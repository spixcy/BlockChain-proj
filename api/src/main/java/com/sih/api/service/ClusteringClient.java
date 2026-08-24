package com.sih.api.service;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;
import java.util.HashMap;
import java.time.Duration;

@Service
public class ClusteringClient {
    private final WebClient webClient;
    public ClusteringClient(WebClient.Builder webClientBuilder) {
        String baseUrl = System.getenv("CLUSTERING_URL");
        if(baseUrl == null) baseUrl = "http://localhost:8000";
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }
    public Map attribute(String address, String chain) {
        Map<String, String> body = new HashMap<>();
        body.put("wallet_address", address);
        body.put("chain", chain);
        
        try {
            return webClient.post().uri("/attribute").bodyValue(body)
                .retrieve().bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(8)) // Failsafe timeout
                .block();
        } catch (Exception e) {
            System.err.println("Clustering Service Timeout or Error: " + e.getMessage());
            return null;
        }
    }
}
