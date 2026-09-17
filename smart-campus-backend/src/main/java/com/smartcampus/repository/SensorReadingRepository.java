package com.smartcampus.repository;

import com.smartcampus.entity.SensorReading;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {

    List<SensorReading> findByRoomCodeOrderByRecordedAtDesc(String roomCode);

    List<SensorReading> findTop10ByRoomCodeOrderByRecordedAtDesc(String roomCode);
}