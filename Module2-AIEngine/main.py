from fastapi import FastAPI
from pydantic import BaseModel
from knowledge_base import (
    classify_attack,
    determine_severity,
    calculate_priority_score,
    determine_priority_level,
    recommend_response
)

app = FastAPI()


class IncidentData(BaseModel):
    attackType: str
    failedAttempts: int | None = None
    targetAsset: str | None = None


@app.get("/health")
def health_check():
    return {"status": "AI engine is running"}


@app.post("/analyze")
def analyze_incident(incident: IncidentData):
    classification = classify_attack(incident.attackType, incident.failedAttempts)
    severity = determine_severity(classification, incident.targetAsset)

    priority_score = calculate_priority_score(severity, incident.targetAsset, incident.failedAttempts)
    priority = determine_priority_level(priority_score)

    recommendations = recommend_response(incident.attackType, priority)

    return {
        "classification": classification,
        "severity": severity,
        "priorityScore": priority_score,
        "priority": priority,
        "recommendations": recommendations
    }