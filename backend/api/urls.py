from django.urls import path

from .views import health, simulation_results

urlpatterns = [
    path("health/", health, name="api-health"),
    path("simulation-results/", simulation_results, name="simulation-results"),
]
