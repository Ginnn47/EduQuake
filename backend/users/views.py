from django.http import JsonResponse


def guest_profile(request):
    return JsonResponse({"displayName": "EduQuake Cadet", "region": "Yogyakarta"})
