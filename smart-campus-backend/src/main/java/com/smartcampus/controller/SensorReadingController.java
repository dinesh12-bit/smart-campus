package com.smartcampus.controller;

import com.smartcampus.entity.SensorReading;
import com.smartcampus.service.SensorReadingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensor/readings")
@RequiredArgsConstructor
public class SensorReadingController {

    private final SensorReadingService service;

    @PostMapping
    public ResponseEntity<SensorReading> saveReading(
            @RequestBody SensorReading reading) {

        return ResponseEntity.ok(service.saveReading(reading));
    }

    @GetMapping
    public ResponseEntity<List<SensorReading>> getAllReadings() {
        return ResponseEntity.ok(service.getAllReadings());
    }

    @GetMapping("/room/{roomCode}")
    public ResponseEntity<List<SensorReading>> getRoomReadings(
            @PathVariable String roomCode) {

        return ResponseEntity.ok(service.getRoomReadings(roomCode));
    }

    @GetMapping("/room/{roomCode}/latest")
    public ResponseEntity<List<SensorReading>> getLatestReadings(
            @PathVariable String roomCode) {

        return ResponseEntity.ok(service.getLatestReadings(roomCode));
    }
}