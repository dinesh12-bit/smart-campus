package com.smartcampus.controller;

import com.smartcampus.dto.ForgotPasswordRequestDTO;
import com.smartcampus.dto.LoginRequestDTO;
import com.smartcampus.dto.LoginResponseDTO;
import com.smartcampus.dto.RegisterRequestDTO;
import com.smartcampus.dto.ResetPasswordRequestDTO;
import com.smartcampus.dto.UserResponseDTO;
import com.smartcampus.entity.User;
import com.smartcampus.service.AuthService;
import com.smartcampus.service.PasswordResetService;
import com.smartcampus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody LoginRequestDTO request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequestDTO request) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequestDTO request) {

        String token = passwordResetService.createResetToken(
                request.getEmail()
        );

        return ResponseEntity.ok(token);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequestDTO request) {

        return ResponseEntity.ok(
                passwordResetService.resetPassword(request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(
            Authentication authentication) {

        User user = userService
                .getUserByEmailOptional(authentication.getName())
                .orElseGet(() ->
                        userService.getUserByUsername(
                                authentication.getName()
                        )
                );

        UserResponseDTO response = UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(response);
    }
}