package com.absensi.absensiv2.services;

import com.absensi.absensiv2.models.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String generateAccessToken(User user);
    String generateRefreshToken(User user);
    String extractEmail(String token);
    Claims extractClaims(String token);
    boolean isTokenValid(String token);
}