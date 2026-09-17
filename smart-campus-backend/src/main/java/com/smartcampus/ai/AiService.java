package com.smartcampus.ai;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AiService {

    private final RestClient restClient;

    public AiService() {

        this.restClient = RestClient.builder()
                .baseUrl("http://127.0.0.1:8000")
                .build();
    }


    public AiPredictionResponse predictAnomaly(
            AiPredictionRequest request
    ) {

        return restClient.post()
                .uri("/predict/anomaly")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(AiPredictionResponse.class);
    }


    public RoomPredictionResponse predictRoom(
            String roomCode
    ) {

        return restClient.get()
                .uri(
                        "/predict/room/{roomCode}",
                        roomCode
                )
                .retrieve()
                .body(RoomPredictionResponse.class);
    }
}