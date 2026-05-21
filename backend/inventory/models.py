from django.db import models


class EmergencyKit(models.Model):
    profile_id = models.PositiveIntegerField()
    items = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "inventory"
