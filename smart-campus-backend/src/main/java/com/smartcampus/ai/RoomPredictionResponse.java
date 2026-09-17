package com.smartcampus.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomPredictionResponse {

    private String roomCode;

    private CurrentData current;

    private PredictionData prediction;

    private AnomalyData anomaly;


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurrentData {

        private Double temperature;
        private Double humidity;
        private Integer motionDetected;
        private Integer lightLevel;
        private String recordedAt;
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PredictionData {

        private Double temperature;
        private Double humidity;
        private String temperatureTrend;
        private String humidityTrend;
        private Integer predictionSteps;
        private Integer approximateSecondsAhead;
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnomalyData {

        private String status;
        private Double score;
    }
}