ZONE_ORDER = [
    "command-center",
    "earthquake-basics",
    "risk-map",
    "home-mitigation",
    "emergency-kit",
    "simulation",
    "evacuation",
    "final-challenge",
]


def unlocked_zones(completed_zones):
    for index, zone_id in enumerate(ZONE_ORDER):
        if zone_id not in completed_zones:
            return ZONE_ORDER[: index + 1]
    return ZONE_ORDER
