ZONE_XP = {
    "command-center": 40,
    "earthquake-basics": 120,
    "risk-map": 140,
    "home-mitigation": 150,
    "emergency-kit": 170,
    "simulation": 190,
    "evacuation": 190,
    "final-challenge": 220,
}


def calculate_xp(completed_zones):
    return sum(ZONE_XP.get(zone_id, 0) for zone_id in completed_zones)
