import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def health(request):
    return JsonResponse({"service": "eduquake-api", "status": "ready"})


@csrf_exempt
def simulation_results(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    scene = payload.get("scene")
    score = payload.get("score")
    completed = payload.get("completed")
    reward = payload.get("reward")

    if scene != "classroom" or not isinstance(score, int) or not isinstance(completed, bool):
        return JsonResponse({"error": "Invalid simulation result"}, status=400)

    return JsonResponse(
        {
            "scene": scene,
            "score": max(0, min(score, 100)),
            "completed": completed,
            "reward": reward or "",
            "saved": False,
        },
        status=201,
    )
