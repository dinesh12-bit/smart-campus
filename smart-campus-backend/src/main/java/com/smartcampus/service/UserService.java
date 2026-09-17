package com.smartcampus.service;

import com.smartcampus.entity.User;
import com.smartcampus.entity.UserRole;
import com.smartcampus.entity.UserStatus;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    public Optional<User> getUserByEmailOptional(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public List<User> getPendingUsers() {
        return userRepository.findByStatusOrderByCreatedAtDesc(
                UserStatus.PENDING
        );
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User updateRole(Long id, UserRole role) {

        User user = getUserById(id);

        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);

        if (role == UserRole.TECHNICIAN && user.getUsername() == null) {
            user.setUsername(generateTechnicianId());
        }

        if (role == UserRole.STUDENT) {
            user.setUsername(null);
        }

        return userRepository.save(user);
    }

    public User updateStatus(Long id, UserStatus status) {

        User user = getUserById(id);

        user.setStatus(status);

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }

    private String generateTechnicianId() {

        String username;

        do {
            username = "TECH-" +
                    UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 12)
                            .toUpperCase();

        } while (userRepository.existsByUsername(username));

        return username;
    }
}