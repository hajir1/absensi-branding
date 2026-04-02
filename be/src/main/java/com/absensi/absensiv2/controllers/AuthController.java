package com.absensi.absensiv2.controllers;


import com.absensi.absensiv2.dtos.*;
import com.absensi.absensiv2.models.User;
import com.absensi.absensiv2.repositories.UserRepository;
import com.absensi.absensiv2.services.AuthService;
import com.absensi.absensiv2.services.JwtService;
import io.github.bucket4j.Bucket;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    @PostMapping("/register")
    public ResponseEntity<WebResponse<UserResponse>> createUser(
            @Valid @RequestBody RegisterRequest req
    ) {
        WebResponse<UserResponse> response = authService.registerUser(req);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        Bucket bucket = authService.resolveBucket(ip);

        if (!bucket.tryConsume(1)) {
            return ResponseEntity
                    .status(429)
                    .body(Map.of("message","Terlalu banyak percobaan login. Coba lagi nanti."));
        }
        TokenResponse token = authService.login(request);
        // 🍪 Refresh token di cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", token.getRefreshToken())
                .httpOnly(true)
                .secure(false) // true kalau HTTPS
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("accessToken", token.getAccessToken(),"message", token.getMessage()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue("refreshToken") String refreshToken) {
        String email = jwtService.extractEmail(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);


        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .secure(false) // true kalau HTTPS
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofDays(7))
                .build();

        return ResponseEntity.ok(
        ).header(HttpHeaders.SET_COOKIE, cookie.toString()).body(Map.of("accessToken", newAccessToken));
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // true kalau HTTPS
                .path("/")
                .maxAge(0) // expire langsung
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("logout");
    }
}
