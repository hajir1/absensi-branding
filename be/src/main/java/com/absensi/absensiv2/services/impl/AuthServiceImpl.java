package com.absensi.absensiv2.services.impl;

import com.absensi.absensiv2.dtos.*;
import com.absensi.absensiv2.models.Divisi;
import com.absensi.absensiv2.models.Role;
import com.absensi.absensiv2.models.User;
import com.absensi.absensiv2.models.VerificationToken;
import com.absensi.absensiv2.repositories.RoleRepository;
import com.absensi.absensiv2.repositories.UserRepository;
import com.absensi.absensiv2.repositories.VerificationTokenRepository;
import com.absensi.absensiv2.services.AuthService;
import com.absensi.absensiv2.services.JwtService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {


    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final EmailServiceImpl emailService;
    private final JwtService jwtService;
    @Override
    /**
     * modul 1
     */
    public WebResponse<UserResponse> registerUser(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email Sudah Ada");
        }


        User user = new User();
        user.setIsVerify(false);
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());

        if(req.getRoleId() != null){
            Role role = roleRepository.findById(req.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Nama Role Tidak Ditemukan"));
            if(role.getNama().equals("Admin")){
                boolean adminExists =
                        userRepository.existsByRole_Nama("ADMIN");

                if (adminExists) {
                    throw new RuntimeException("Admin sudah ada");
                }
            }
            user.setRole(role);
        }
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        userRepository.save(user);

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .created_at(user.getCreatedAt())
                .updated_at(user.getUpdatedAt())
                .build();

        return WebResponse.<UserResponse>builder()
                .data(response)
                .build();
    }

    @Transactional
    public TokenResponse login(LoginRequest request){

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Email atau Password Salah"
                        ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Email atau Password Salah"
            );
        }
//        if(!user.getIsVerify()){
//
//            String token = UUID.randomUUID().toString();
//            VerificationToken vt = new VerificationToken();
//            vt.setUser(user);
//            vt.setExpiryDate(LocalDateTime.now().plusHours(24));
//
//            tokenRepository.save(vt);
//            emailService.sendVerificationEmail(user.getEmail(),token);
//            vt.setToken(token);
//
//            return new TokenResponse("","","Verifikasi token dikirimkan");
//        }else{
//
//            String accessToken = jwtService.generateAccessToken(user);
//            String refreshToken = jwtService.generateRefreshToken(user);
//            return new TokenResponse(accessToken, refreshToken,"");
//        }
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            return new TokenResponse(accessToken, refreshToken,"");

    }
    public Bucket resolveBucket(String ip) {
        return buckets.computeIfAbsent(ip, k ->
                Bucket.builder()
                        .addLimit(Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1))))
                        .build()
        );
    }
}
