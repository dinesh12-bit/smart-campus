package com.smartcampus.controller;

import com.smartcampus.dto.UserResponseDTO;
import com.smartcampus.entity.User;
import com.smartcampus.entity.UserRole;
import com.smartcampus.entity.UserStatus;
import com.smartcampus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers()
                .stream()
                .map(UserResponseDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Long id
    ) {
        User user = userService.getUserById(id);

        return ResponseEntity.ok(
                UserResponseDTO.fromEntity(user)
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<UserResponseDTO>> getPendingUsers() {
        List<UserResponseDTO> users = userService.getPendingUsers()
                .stream()
                .map(UserResponseDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserResponseDTO> updateRole(
            @PathVariable Long id,
            @RequestParam UserRole role
    ) {
        User user = userService.updateRole(id, role);

        return ResponseEntity.ok(
                UserResponseDTO.fromEntity(user)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<UserResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status
    ) {
        User user = userService.updateStatus(id, status);

        return ResponseEntity.ok(
                UserResponseDTO.fromEntity(user)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id
    ) {
        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }
}