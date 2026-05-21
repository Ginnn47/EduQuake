from django.db import models


class PreparednessProfile(models.Model):
    display_name = models.CharField(max_length=120)
    region = models.CharField(max_length=120, default="Yogyakarta")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "users"
