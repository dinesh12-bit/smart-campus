package com.smartcampus.dto;

import com.smartcampus.entity.ComplaintCategory;
import com.smartcampus.entity.ComplaintPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintRequestDTO {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Subject is required")
    @Size(
            max = 100,
            message = "Subject cannot exceed 100 characters"
    )
    private String subject;

    @NotBlank(message = "Description is required")
    @Size(
            max = 1000,
            message = "Description cannot exceed 1000 characters"
    )
    private String description;

    @NotNull(message = "Category is required")
    private ComplaintCategory category;

    @NotNull(message = "Priority is required")
    private ComplaintPriority priority;

    private String imageData;
}