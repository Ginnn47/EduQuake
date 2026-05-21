BADGES = [
    {"id": "aware-citizen", "min_xp": 0},
    {"id": "prepared-resident", "min_xp": 260},
    {"id": "survival-ready", "min_xp": 560},
    {"id": "community-guardian", "min_xp": 900},
]


def unlocked_badges(xp):
    return [badge for badge in BADGES if xp >= badge["min_xp"]]
