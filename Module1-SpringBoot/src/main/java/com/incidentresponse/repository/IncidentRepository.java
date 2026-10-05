package com.incidentresponse.repository;

import com.incidentresponse.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByAttackType(String attackType);
    List<Incident> findByStatus(String status);
}
