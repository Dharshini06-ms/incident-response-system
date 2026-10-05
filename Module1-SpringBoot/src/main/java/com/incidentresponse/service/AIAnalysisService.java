package com.incidentresponse.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Service
public class AIAnalysisService {

    private final WebClient webClient = WebClient.create("http://127.0.0.1:8000");

    public Map<String, Object> analyze(String attackType, Integer failedAttempts, String targetAsset) {
        Map<String, Object> requestBody = Map.of(
                "attackType", attackType,
                "failedAttempts", failedAttempts == null ? 0 : failedAttempts,
                "targetAsset", targetAsset == null ? "" : targetAsset
        );

        return webClient.post()
                .uri("/analyze")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}