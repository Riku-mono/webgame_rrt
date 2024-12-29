from django.db import models

class User(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Users'

    def __str__(self):
        return str(self.id)
    
class MatchResult(models.Model):
    WINNER_CHOICES = (
        (0, 'Draw'),
        (1, 'Player1'),
        (2, 'Player2'),
    )

    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='match_results')
    result = models.IntegerField(choices=WINNER_CHOICES)
    played_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Match Results'

    def __str__(self):
        return f"{self.user_id}: {self.result} at {self.played_at}"
