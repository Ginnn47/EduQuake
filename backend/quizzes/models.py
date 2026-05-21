from django.db import models


class QuizAttempt(models.Model):
    profile_id = models.PositiveIntegerField()
    quiz_id = models.CharField(max_length=80)
    score = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "quizzes"
