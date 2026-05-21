from django.db import models


class JourneyProgress(models.Model):
    profile_id = models.PositiveIntegerField()
    active_zone = models.CharField(max_length=80, default="command-center")
    completed_zones = models.JSONField(default=list)
    xp = models.PositiveIntegerField(default=0)

    class Meta:
        app_label = "progression"
