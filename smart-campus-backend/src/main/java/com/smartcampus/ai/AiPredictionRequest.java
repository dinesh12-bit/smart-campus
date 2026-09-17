package com.smartcampus.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiPredictionRequest {

    private Double temperature;
    private Double humidity;
    private Integer motionDetected;
    private Integer lightLevel;
}