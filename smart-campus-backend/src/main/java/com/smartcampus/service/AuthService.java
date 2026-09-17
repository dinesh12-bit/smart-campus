package com.smartcampus.service;

import com.smartcampus.dto.LoginRequestDTO;
import com.smartcampus.dto.LoginResponseDTO;
import com.smartcampus.dto.RegisterRequestDTO;
import com.smartcampus.entity.User;
import com.smartcampus.entity.UserRole;
import com.smartcampus.entity.UserStatus;
import com.smartcampus.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDTO login(LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user;

        try {
            user = userService.getUserByEmail(request.getUsername());
        } catch (RuntimeException e) {
            user = userService.getUserByUsername(request.getUsername());
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return LoginResponseDTO.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public String register(RegisterRequestDTO request) {

        if (userService.getUserByEmailOptional(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.STUDENT)
                .status(UserStatus.PENDING)
                .build();

        userService.saveUser(user);

        return "Registration submitted. Waiting for admin approval.";
    }
}