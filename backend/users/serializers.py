def serialize_profile(profile):
    return {
        "id": profile.id,
        "displayName": profile.display_name,
        "region": profile.region,
    }
