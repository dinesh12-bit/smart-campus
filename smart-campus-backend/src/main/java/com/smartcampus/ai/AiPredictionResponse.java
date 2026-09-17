package com.smartcampus.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiPredictionResponse {

    private String roomCode;
    private Double temperature;
    private Double humidity;
    private Integer motionDetected;
    private Integer lightLevel;
    private AiResult ai;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiResult {

        private String status;
        private Double anomalyScore;
    }
}