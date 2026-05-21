def review_hint(score):
    if score >= 90:
        return "community-ready"
    if score >= 75:
        return "passed-with-review"
    return "repeat-core-zones"
