package com.incidentresponse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Source IP is required")
    private String sourceIp;

    private String destinationIp;

    @NotBlank(message = "Attack type is required")
    private String attackType;

    private Integer failedAttempts;

    private String targetAsset;

    private String classification;

    private String severity;

    private Integer priorityScore;

    private String priority;

    @ElementCollection
    private List<String> recommendations;

    @Column(updatable = false)
    private LocalDateTime timestamp;

    private String status = "OPEN";

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
        if (this.status == null) {
            this.status = "OPEN";
        }
    }
}