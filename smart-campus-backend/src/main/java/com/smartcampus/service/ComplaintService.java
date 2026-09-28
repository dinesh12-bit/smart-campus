package com.smartcampus.service;

import com.smartcampus.dto.ComplaintRequestDTO;
import com.smartcampus.dto.ComplaintResponseDTO;
import com.smartcampus.entity.Complaint;
import com.smartcampus.entity.ComplaintPriority;
import com.smartcampus.entity.ComplaintStatus;
import com.smartcampus.entity.Room;
import com.smartcampus.entity.User;
import com.smartcampus.entity.UserRole;
import com.smartcampus.repository.ComplaintRepository;
import com.smartcampus.repository.RoomRepository;
import com.smartcampus.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    // =========================================================
    // CREATE COMPLAINT
    // =========================================================

    public ComplaintResponseDTO createComplaint(
            ComplaintRequestDTO request
    ) {

        User student = userRepository.findById(
                request.getStudentId()
        ).orElseThrow(() ->
                new EntityNotFoundException(
                        "Student not found with ID: "
                                + request.getStudentId()
                )
        );

        /*
         * Frontend sends:
         * ROOM-204
         * ROOM-203
         * etc.
         *
         * We find the corresponding Room entity here.
         */
        Room room = roomRepository.findAll()
                .stream()
                .filter(existingRoom ->
                        existingRoom.getRoomCode() != null
                                && existingRoom
                                .getRoomCode()
                                .equalsIgnoreCase(
                                        request.getLocation().trim()
                                )
                )
                .findFirst()
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Room not found: "
                                        + request.getLocation()
                        )
                );

        Complaint complaint = Complaint.builder()

                .student(student)

                .room(room)

                .title(
                        request.getSubject().trim()
                )

                .description(
                        request.getDescription().trim()
                )

                .imageData(
                        request.getImageData()
                )

                .category(
                        request.getCategory()
                )

                .priority(
                        request.getPriority() != null
                                ? request.getPriority()
                                : ComplaintPriority.MEDIUM
                )

                .status(
                        ComplaintStatus.PENDING
                )

                .build();

        Complaint savedComplaint =
                complaintRepository.save(complaint);

        return ComplaintResponseDTO.fromEntity(
                savedComplaint
        );
    }

    // =========================================================
    // GET ALL COMPLAINTS
    // =========================================================

    public List<ComplaintResponseDTO> getAllComplaints() {

        return complaintRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ComplaintResponseDTO::fromEntity)
                .toList();
    }

    // =========================================================
    // GET COMPLAINT BY ID
    // =========================================================

    public ComplaintResponseDTO getComplaintById(
            Long id
    ) {

        Complaint complaint =
                complaintRepository.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Complaint not found with ID: "
                                                + id
                                )
                        );

        return ComplaintResponseDTO.fromEntity(
                complaint
        );
    }

    // =========================================================
    // GET STUDENT COMPLAINTS
    // =========================================================

    public List<ComplaintResponseDTO> getStudentComplaints(
            Long studentId
    ) {

        return complaintRepository
                .findByStudentIdOrderByCreatedAtDesc(
                        studentId
                )
                .stream()
                .map(ComplaintResponseDTO::fromEntity)
                .toList();
    }

    // =========================================================
    // ASSIGN TECHNICIAN
    // =========================================================

    public ComplaintResponseDTO assignTechnician(
            Long complaintId,
            Long technicianId
    ) {

        Complaint complaint =
                complaintRepository.findById(complaintId)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Complaint not found with ID: "
                                                + complaintId
                                )
                        );

        User technician =
                userRepository.findById(technicianId)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Technician not found with ID: "
                                                + technicianId
                                )
                        );

        if (technician.getRole() != UserRole.TECHNICIAN) {

            throw new IllegalArgumentException(
                    "Selected user is not a technician"
            );
        }

        if (technician.getStatus()
                != com.smartcampus.entity.UserStatus.ACTIVE) {

            throw new IllegalArgumentException(
                    "Technician is not active"
            );
        }

        complaint.setTechnician(technician);
        complaint.setStatus(ComplaintStatus.ASSIGNED);

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        return ComplaintResponseDTO.fromEntity(
                updatedComplaint
        );
    }

    // =========================================================
    // GET TECHNICIAN COMPLAINTS
    // =========================================================

    public List<ComplaintResponseDTO> getTechnicianComplaints(
            Long technicianId
    ) {

        User technician =
                userRepository.findById(technicianId)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Technician not found with ID: "
                                                + technicianId
                                )
                        );

        if (technician.getRole() != UserRole.TECHNICIAN) {

            throw new IllegalArgumentException(
                    "User is not a technician"
            );
        }

        return complaintRepository
                .findByTechnicianIdOrderByCreatedAtDesc(
                        technicianId
                )
                .stream()
                .map(ComplaintResponseDTO::fromEntity)
                .toList();
    }

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    public ComplaintResponseDTO updateStatus(
            Long id,
            ComplaintStatus status
    ) {

        Complaint complaint =
                complaintRepository.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Complaint not found with ID: "
                                                + id
                                )
                        );

        complaint.setStatus(status);

        Complaint updatedComplaint =
                complaintRepository.save(complaint);

        return ComplaintResponseDTO.fromEntity(
                updatedComplaint
        );
    }
}