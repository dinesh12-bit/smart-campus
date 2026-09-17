package com.smartcampus.dto;

import com.smartcampus.entity.UserRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private String token;
    private Long userId;
    private String name;
    private String username;
    private String email;
    private UserRole role;
}