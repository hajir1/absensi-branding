package com.absensi.absensiv2.services.filters;

import com.absensi.absensiv2.models.User;
import com.absensi.absensiv2.repositories.UserRepository;
import com.absensi.absensiv2.services.JwtService;
import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor

/**
 * modul 3
 */
public class JwtAuthenticateFilters extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/api/v1/auth");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // ❌ Tidak ada token → lanjut saja
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {

            // ⭐ Parse JWT
            Claims parse = jwtService.extractClaims(token);
            Integer userId = parse.get("id", Integer.class);
            // ⭐ Ambil user dari database

            System.out.println("userid"+ userId);
            userRepository.findById(userId).ifPresent(user -> {

                // ⭐ Convert role → authorities (single role)
                List<GrantedAuthority> authorities =
                        user.getRole() == null
                                ? List.of(new SimpleGrantedAuthority("ROLE_USER"))
                                : List.of(
                                new SimpleGrantedAuthority(
                                        "ROLE_" + user.getRole().getNama()
                                )
                        );
                // ⭐ Buat Authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                null,
                                authorities
                        );

                // ⭐ Set ke Security Context (PENTING 🔥)
                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            });

            System.out.println("AUTHenticate: " +
                    SecurityContextHolder.getContext().getAuthentication());
        } catch (ExpiredJwtException e) {
            request.setAttribute("error","token expired");
            e.printStackTrace();
        } catch (MalformedJwtException e) {
            request.setAttribute("error","invalid token");
            e.printStackTrace();
        } catch (JwtException e) {
            request.setAttribute("error","invalid token");
            e.printStackTrace();
        } catch (Exception e) {
            request.setAttribute("error","invalid token");
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);


    }
}
