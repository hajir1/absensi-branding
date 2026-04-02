package com.absensi.absensiv2.services.impl;

import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailServiceImpl {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) {

        String link = "http://localhost:8080/api/v1/auth/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Verifikasi Email");
        message.setText("Klik link berikut untuk verifikasi:\n" + link);

        mailSender.send(message);
    }
}
