package com.smartcampus.service;

import com.smartcampus.entity.SensorReading;
import com.smartcampus.repository.SensorReadingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SensorReadingService {

    private final SensorReadingRepository repository;

    public SensorReading saveReading(SensorReading reading) {
        if (reading.getRecordedAt() == null) {
            reading.setRecordedAt(LocalDateTime.now());
        }

        return repository.save(reading);
    }

    public List<SensorReading> getAllReadings() {
        return repository.findAll();
    }

    public List<SensorReading> getRoomReadings(String roomCode) {
        return repository.findByRoomCodeOrderByRecordedAtDesc(roomCode);
    }

    public List<SensorReading> getLatestReadings(String roomCode) {
        return repository.findTop10ByRoomCodeOrderByRecordedAtDesc(roomCode);
    }
}