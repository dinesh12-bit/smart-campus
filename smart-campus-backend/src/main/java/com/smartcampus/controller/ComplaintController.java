package com.smartcampus.controller;

import com.smartcampus.dto.ComplaintRequestDTO;
import com.smartcampus.dto.ComplaintResponseDTO;
import com.smartcampus.entity.ComplaintStatus;
import com.smartcampus.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    private final ComplaintService complaintService;

    // Create complaint
    @PostMapping
    public ResponseEntity<ComplaintResponseDTO> createComplaint(
            @Valid @RequestBody ComplaintRequestDTO request
    ) {

        ComplaintResponseDTO response =
                complaintService.createComplaint(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all complaints
    @GetMapping
    public ResponseEntity<List<ComplaintResponseDTO>> getAllComplaints() {

        return ResponseEntity.ok(
                complaintService.getAllComplaints()
        );
    }

    // Get complaint by ID
    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponseDTO> getComplaintById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                complaintService.getComplaintById(id)
        );
    }

    // Get complaints of a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ComplaintResponseDTO>> getStudentComplaints(
            @PathVariable Long studentId
    ) {

        return ResponseEntity.ok(
                complaintService.getStudentComplaints(studentId)
        );
    }

    // Assign technician
    @PutMapping("/{id}/assign/{technicianId}")
    public ResponseEntity<ComplaintResponseDTO> assignTechnician(
            @PathVariable Long id,
            @PathVariable Long technicianId
    ) {

        return ResponseEntity.ok(
                complaintService.assignTechnician(
                        id,
                        technicianId
                )
        );
    }

    // Get technician complaints
    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<ComplaintResponseDTO>> getTechnicianComplaints(
            @PathVariable Long technicianId
    ) {

        return ResponseEntity.ok(
                complaintService.getTechnicianComplaints(
                        technicianId
                )
        );
    }

    // Update complaint status
    @PutMapping("/{id}/status")
    public ResponseEntity<ComplaintResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam ComplaintStatus status
    ) {

        return ResponseEntity.ok(
                complaintService.updateStatus(id, status)
        );
    }
}