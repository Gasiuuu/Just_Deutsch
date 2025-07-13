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