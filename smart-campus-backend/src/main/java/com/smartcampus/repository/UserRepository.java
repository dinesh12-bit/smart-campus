package com.smartcampus.repository;

import com.smartcampus.entity.User;
import com.smartcampus.entity.UserRole;
import com.smartcampus.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Student login / email based lookup
    Optional<User> findByEmail(String email);

    // Technician / Admin username based lookup
    Optional<User> findByUsername(String username);

    // Check whether email is already registered
    boolean existsByEmail(String email);

    // Check whether generated username already exists
    boolean existsByUsername(String username);

    // Admin can see users by role
    List<User> findByRole(UserRole role);

    // Admin can see pending users
    List<User> findByStatus(UserStatus status);

    // Pending users sorted by newest first
    List<User> findByStatusOrderByCreatedAtDesc(
            UserStatus status
    );
}