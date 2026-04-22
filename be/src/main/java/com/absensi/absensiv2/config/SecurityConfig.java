package com.absensi.absensiv2.config;

import com.absensi.absensiv2.exceptions.ApiError;
import com.absensi.absensiv2.services.filters.JwtAuthenticateFilters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthenticateFilters jwtAuthenticateFilters;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
//
//    @Bean
//    public UserDetailsService users(){
//        User.UserBuilder userBuilder = User.withDefaultPasswordEncoder();
//
//        UserDetails user1 = userBuilder.username("hajir").password("hajir").roles("ADMIN").build();
//        UserDetails user2 = userBuilder.username("hajir2").password("hajir2").roles("ADMIN").build();
//
//        return new InMemoryUserDetailsManager(user1, user2);
//    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable).cors(Customizer.withDefaults())

//                // ⭐ Matikan login default Spring
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
//
//                // ⭐ Stateless (WAJIB untuk JWT)
        .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

                // ⭐ Authorization rules
        http.authorizeHttpRequests(auth -> auth

                        // Endpoint publik
                        .requestMatchers(
                                "/api/v1/auth/**"
                        ).permitAll()
//                        .requestMatchers(
//                                "/api/v1/roles/get"
//                        ).permitAll()
//                        .requestMatchers(
//                                "/profile/**"
//                        ).permitAll()
//                        .requestMatchers(
//                                "/absensi/**"
//                        ).permitAll()
                        .anyRequest().authenticated()
                ).exceptionHandling(exs -> exs.authenticationEntryPoint((req,res,ex)->{
                    ex.printStackTrace();
                    res.setStatus(401);
                    res.setContentType("application/json");
                    String message = ex.getMessage();
                    var errorMessage = ApiError.of(HttpStatus.UNAUTHORIZED.value(), "Unauthorized Access",message,req.getRequestURI(),true);
                    var objectMapper = new ObjectMapper();
                    res.getWriter().write(objectMapper.writeValueAsString(errorMessage));
        }))

                // ⭐ JWT Filter
                .addFilterBefore(
                        jwtAuthenticateFilters,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

}
