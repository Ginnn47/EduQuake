from django.http import JsonResponse


def health(request):
    return JsonResponse({"service": "eduquake-api", "status": "ready"})
