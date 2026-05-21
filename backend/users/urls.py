from django.urls import path

from .views import guest_profile

urlpatterns = [
    path("guest/", guest_profile, name="guest-profile"),
]
