package com.smartcampus.dto;

import com.smartcampus.entity.Complaint;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintResponseDTO {

    private Long id;

    private Long studentId;
    private String studentName;

    private Long roomId;
    private String roomCode;

    private String title;
    private String description;

    private String category;
    private String priority;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long technicianId;
    private String technicianName;
    private String technicianUsername;

    public static ComplaintResponseDTO fromEntity(
            Complaint complaint
    ) {

        return ComplaintResponseDTO.builder()

                .id(complaint.getId())

                .studentId(
                        complaint.getStudent() != null
                                ? complaint.getStudent().getId()
                                : null
                )

                .studentName(
                        complaint.getStudent() != null
                                ? complaint.getStudent().getName()
                                : null
                )

                .roomId(
                        complaint.getRoom() != null
                                ? complaint.getRoom().getId()
                                : null
                )

                .roomCode(
                        complaint.getRoom() != null
                                ? complaint.getRoom().getRoomCode()
                                : null
                )

                .title(
                        complaint.getTitle()
                )

                .description(
                        complaint.getDescription()
                )

                .category(
                        complaint.getCategory() != null
                                ? complaint.getCategory().name()
                                : null
                )

                .priority(
                        complaint.getPriority() != null
                                ? complaint.getPriority().name()
                                : null
                )

                .status(
                        complaint.getStatus() != null
                                ? complaint.getStatus().name()
                                : null
                )

                .createdAt(
                        complaint.getCreatedAt()
                )

                .updatedAt(
                        complaint.getUpdatedAt()
                )

                .technicianId(
                        complaint.getTechnician() != null
                                ? complaint.getTechnician().getId()
                                : null
                )

                .technicianName(
                        complaint.getTechnician() != null
                                ? complaint.getTechnician().getName()
                                : null
                )

                .technicianUsername(
                        complaint.getTechnician() != null
                                ? complaint.getTechnician().getUsername()
                                : null
                )

                .build();
    }
}