package com.smartcampus.controller;

import com.smartcampus.ai.AiPredictionRequest;
import com.smartcampus.ai.AiPredictionResponse;
import com.smartcampus.ai.AiService;
import com.smartcampus.ai.RoomPredictionResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;


    @PostMapping("/anomaly")
    public ResponseEntity<AiPredictionResponse> predictAnomaly(
            @RequestBody AiPredictionRequest request
    ) {

        AiPredictionResponse response =
                aiService.predictAnomaly(request);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/room/{roomCode}")
    public ResponseEntity<RoomPredictionResponse> predictRoom(
            @PathVariable String roomCode
    ) {

        RoomPredictionResponse response =
                aiService.predictRoom(roomCode);

        return ResponseEntity.ok(response);
    }
}