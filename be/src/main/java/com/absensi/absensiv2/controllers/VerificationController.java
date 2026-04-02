package com.absensi.absensiv2.controllers;

import com.absensi.absensiv2.models.User;
import com.absensi.absensiv2.models.VerificationToken;
import com.absensi.absensiv2.repositories.UserRepository;
import com.absensi.absensiv2.repositories.VerificationTokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@AllArgsConstructor
public class VerificationController {

    private final VerificationTokenRepository tokenRepository;

    private final UserRepository userRepository;

        @GetMapping("/api/v1/auth/verify")
        public String verify(@RequestParam String token) {

        VerificationToken vt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token tidak valid"));

        if (vt.getExpiryDate().isBefore(LocalDateTime.now())) {
            return "Token sudah expired";
        }

        User user = vt.getUser();
        user.setIsVerify(true);
        userRepository.save(user);

        return "Email berhasil diverifikasi!";
    }
}