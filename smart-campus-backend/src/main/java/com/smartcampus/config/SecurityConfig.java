package com.smartcampus.config;

import com.smartcampus.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final PasswordEncoder passwordEncoder;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .csrf(csrf ->
                        csrf.disable()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // ==============================
                        // CORS PREFLIGHT
                        // ==============================

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()


                        // ==============================
                        // AUTH
                        // ==============================

                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password"
                        )
                        .permitAll()


                        // ==============================
                        // AUTHENTICATED USER
                        // ==============================

                        .requestMatchers(
                                "/api/auth/me"
                        )
                        .authenticated()


                        // ==============================
                        // ADMIN ONLY
                        // ==============================

                        .requestMatchers(
                                "/api/users/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/rooms/**"
                        )
                        .hasRole("ADMIN")


                        // ==============================
                        // ESP32 SENSOR DATA
                        // ==============================

                        // ESP32 sends sensor data
                        // No JWT required
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/sensor/readings"
                        )
                        .permitAll()


                        // ==============================
                        // SENSOR DATA READ
                        // ==============================

                        // Dashboard can read sensor data
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/sensor/readings"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "TECHNICIAN",
                                "STUDENT"
                        )


                        // Other sensor operations
                        .requestMatchers(
                                "/api/sensor/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "TECHNICIAN"
                        )


                        // ==============================
                        // COMPLAINTS
                        // ==============================

                        .requestMatchers(
                                "/api/complaints/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "STUDENT",
                                "TECHNICIAN"
                        )


                        // ==============================
                        // ERROR
                        // ==============================

                        .requestMatchers(
                                "/error"
                        )
                        .permitAll()


                        // ==============================
                        // EVERYTHING ELSE
                        // ==============================

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // ==============================
    // CORS CONFIGURATION
    // ==============================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "https://dinesh12-bit.github.io"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "Origin",
                        "X-Requested-With"
                )
        );

        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // ==============================
    // AUTHENTICATION MANAGER
    // ==============================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}