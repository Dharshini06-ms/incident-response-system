# This file holds our "rules" - the knowledge the AI uses to reason.
# Think of each rule as: IF (condition) THEN (conclusion)


def classify_attack(attack_type: str, failed_attempts: int) -> str:
    """
    Determines the specific classification of the attack
    based on simple facts we know about it.
    """
    if attack_type.lower() == "brute force" and failed_attempts and failed_attempts > 10:
        return "Brute Force Attack (confirmed)"

    if attack_type.lower() == "sql injection":
        return "SQL Injection Attempt"

    if attack_type.lower() == "malware":
        return "Malware Detected"

    if attack_type.lower() == "ddos":
        return "DDoS Attack"

    if attack_type.lower() == "port scan":
        return "Port Scanning Activity"

    if attack_type.lower() == "phishing":
        return "Phishing Attempt"

    return "Unclassified Incident"


def determine_severity(classification: str, target_asset: str) -> str:
    """
    Decides how severe the incident is, based on what
    it was classified as and what it targeted.
    """
    high_risk_targets = ["admin", "root", "database", "server"]

    is_high_value_target = False
    if target_asset:
        is_high_value_target = any(word in target_asset.lower() for word in high_risk_targets)

    if "confirmed" in classification.lower() and is_high_value_target:
        return "CRITICAL"

    if "confirmed" in classification.lower():
        return "HIGH"

    if classification == "Unclassified Incident":
        return "LOW"

    return "MEDIUM"


def calculate_priority_score(severity: str, target_asset: str, failed_attempts: int) -> int:
    """
    Adds up several factors to get one overall urgency score (0-100).
    This is the 'Heuristic Search' concept - estimating urgency
    using multiple weighted factors instead of a single rule.
    """
    score = 0

    severity_scores = {"CRITICAL": 40, "HIGH": 30, "MEDIUM": 15, "LOW": 5}
    score += severity_scores.get(severity, 0)

    high_risk_targets = ["admin", "root", "database", "server"]
    if target_asset and any(word in target_asset.lower() for word in high_risk_targets):
        score += 30
    else:
        score += 10

    if failed_attempts:
        if failed_attempts > 20:
            score += 20
        elif failed_attempts > 10:
            score += 10
        else:
            score += 5

    if severity == "CRITICAL":
        score += 10

    return min(score, 100)


def determine_priority_level(score: int) -> str:
    """Converts the numeric score into a priority label."""
    if score >= 80:
        return "CRITICAL"
    elif score >= 50:
        return "HIGH"
    elif score >= 25:
        return "MEDIUM"
    else:
        return "LOW"


def recommend_response(attack_type: str, priority: str) -> list:
    """
    IF-THEN response rules - given the attack type and priority,
    what should the analyst actually do?
    """
    attack_type = attack_type.lower()

    if attack_type == "brute force" and priority in ["CRITICAL", "HIGH"]:
        return ["Block source IP", "Enable MFA", "Notify administrator"]

    if attack_type == "malware":
        return ["Isolate affected device", "Block file hash", "Notify administrator"]

    if attack_type == "ddos":
        return ["Block suspicious IPs", "Enable rate limiting", "Notify network administrator"]

    if attack_type == "sql injection":
        return ["Block source IP", "Review database logs", "Patch vulnerable endpoint"]

    if attack_type == "port scan":
        return ["Monitor source IP", "Review firewall rules"]

    if attack_type == "phishing":
        return ["Block sender domain", "Alert affected users", "Notify administrator"]

    return ["Review incident manually"]