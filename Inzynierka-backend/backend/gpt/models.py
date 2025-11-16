import uuid

from django.db import models
from django.conf import settings

# Create your models here.

class Prompt(models.Model):
    LANGUAGE_LEVEL_CHOICES = (
        ('a1', 'A1'),
        ('a2', 'A2'),
        ('b1', 'B1'),
        ('b2', 'B2'),
        ('c1', 'C1'),
        ('c2', 'C2'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='prompts')
    level = models.CharField(max_length=2, choices=LANGUAGE_LEVEL_CHOICES)
    text = models.TextField(help_text='Prompt wysłany do OpenAI')
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.level} - {self.createdAt:%d-%m-%Y %M:%H}"


class DailyChallenge(models.Model):

    LANGUAGE_LEVEL_CHOICES = (
        ('a1', 'A1'),
        ('a2', 'A2'),
        ('b1', 'B1'),
        ('b2', 'B2'),
        ('c1', 'C1'),
        ('c2', 'C2'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='daily_challenges'
    )
    date = models.DateField(help_text='Data wyzwania')
    user_level = models.CharField(
        max_length=2,
        choices=LANGUAGE_LEVEL_CHOICES,
        help_text='Poziom językowy użytkownika w momencie generowania'
    )

    completed = models.BooleanField(default=False)
    score = models.IntegerField(null=True, blank=True, help_text='Uzyskane punkty')
    max_score = models.IntegerField(help_text='Maksymalna liczba punktów')

    tasks = models.JSONField(help_text='Lista zadań w formacie JSON')
    metadata = models.JSONField(default=dict, blank=True, help_text='Dodatkowe metadane (difficulty, estimatedTime, topics, etc.)')

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(help_text='Data wygaśnięcia wyzwania')
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date']
        constraints = [
            models.UniqueConstraint(fields=['user', 'date'], name='unique_daily_challenge'),
        ]
        indexes = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['user', 'completed']),
        ]

    def __str__(self):
        status = "✓" if self.completed else "○"
        return f"{status} {self.user.username} - {self.date} ({self.user_level})"

    @property
    def percentage(self):
        if self.max_score > 0 and self.score is not None:
            return round((self.score / self.max_score) * 100, 2)
        return 0


class UserStreak(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='streak',
        primary_key=True
    )
    streak_days = models.IntegerField(default=0, help_text='Aktualna seria dni z ukończonymi wyzwaniami')
    longest_streak = models.IntegerField(default=0, help_text='Najdłuższa seria dni')
    last_completed_date = models.DateField(null=True, blank=True, help_text='Data ostatniego ukończonego wyzwania')
    total_challenges_completed = models.IntegerField(default=0, help_text='Łączna liczba ukończonych wyzwań')
    total_points = models.IntegerField(default=0, help_text='Łączna liczba zdobytych punktów')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Streak'
        verbose_name_plural = 'User Streaks'

    def __str__(self):
        return f"{self.user.username} - Streak: {self.streak_days} days (Best: {self.longest_streak})"
