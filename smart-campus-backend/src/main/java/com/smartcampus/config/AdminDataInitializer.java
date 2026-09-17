package com.smartcampus.config;

import com.smartcampus.entity.User;
import com.smartcampus.entity.UserRole;
import com.smartcampus.entity.UserStatus;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.findByEmail("admin@smartcampus.com").isEmpty()) {

            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@smartcampus.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(UserRole.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            userRepository.save(admin);

            System.out.println("Default admin created.");
        }
    }
}