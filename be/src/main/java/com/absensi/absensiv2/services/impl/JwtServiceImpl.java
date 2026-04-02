package com.absensi.absensiv2.services.impl;

import com.absensi.absensiv2.models.User;
import com.absensi.absensiv2.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    private final com.absensi.absensiv2.config.properties.JwtProperties jwt;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(jwt.getSecret().getBytes());
    }

    // ⭐ Access Token
    @Override
    public String generateAccessToken(User user) {

        long ttlMillis = jwt.getAccessToken().getTtlSeconds() * 1000;

        return Jwts.builder()
                .subject(user.getEmail())
                .issuer(jwt.getIssuer())
                .claim("id", user.getId())
                .claim("username", user.getUsername())
                .claim("nim", user.getNim())
                .claim("foto", user.getFoto())
                .claim("mentorId",
                        user.getMentor() != null
                                ? user.getMentor().getId()
                                : null
                )
                .claim("mentorName",
                        user.getMentor() != null
                                ? user.getMentor().getUsername()
                                : null
                )
                .claim("roleId",
                        user.getRole() != null
                                ? user.getRole().getId()
                                : null
                )
                .claim("roleName",
                        user.getRole() != null
                                ? user.getRole().getNama()
                                : null
                )
                .claim("divisiId",
                        user.getDivisi() != null
                                ? user.getDivisi().getId()
                                : null
                )
                .claim("divisiName",
                        user.getDivisi() != null
                                ? user.getDivisi().getNama()
                                : null
                )
                .claim("access", "typ")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttlMillis))
                .signWith(getKey())
                .compact();
    }

    // ⭐ Refresh Token
    @Override
    public String generateRefreshToken(User user) {

        long ttlMillis = jwt.getRefreshToken().getTtlSeconds() * 1000;

        return Jwts.builder()
                .subject(user.getEmail())
                .issuer(jwt.getIssuer())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttlMillis))
                .signWith(getKey())
                .compact();
    }

    // ⭐ Extract Email
    @Override
    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    public boolean isTokenValid(String token) {
        User user = new User();
        Claims data = extractClaims(token);
        return data.getSubject().equals(user.getEmail());
    }
}