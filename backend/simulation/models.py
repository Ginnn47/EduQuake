from django.db import models


class SimulationRun(models.Model):
    profile_id = models.PositiveIntegerField()
    scenario = models.CharField(max_length=80)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "simulation"
