package com.smartcampus.repository;

import com.smartcampus.entity.Complaint;
import com.smartcampus.entity.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository
        extends JpaRepository<Complaint, Long> {

    List<Complaint> findByStudentIdOrderByCreatedAtDesc(
            Long studentId
    );

    List<Complaint> findByRoomIdOrderByCreatedAtDesc(
            Long roomId
    );

    List<Complaint> findByStatusOrderByCreatedAtDesc(
            ComplaintStatus status
    );

    List<Complaint> findByTechnicianIdOrderByCreatedAtDesc(
            Long technicianId
    );

    List<Complaint> findAllByOrderByCreatedAtDesc();
}