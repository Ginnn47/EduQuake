from django.db import models


class Achievement(models.Model):
    profile_id = models.PositiveIntegerField()
    achievement_id = models.CharField(max_length=80)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "achievements"
