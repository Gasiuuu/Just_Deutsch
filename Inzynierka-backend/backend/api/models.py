from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.files.base import ContentFile
from django.db import models
from io import BytesIO
from gtts import gTTS

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    LANGUAGE_LEVEL_CHOICES = (
        ('a1', 'A1'),
        ('a2', 'A2'),
        ('b1', 'B1'),
        ('b2', 'B2'),
        ('c1', 'C1'),
        ('c2', 'C2'),
    )
    PREFERENCES_CHOICES = (
        ('sport', 'Sport'),
        ('podroze', 'Podróże'),
        ('motoryzacja', 'Motoryzacja'),
        ('dom i ogrod', 'Dom i ogród'),
        ('czlowiek', 'Człowiek'),
        ('moda', 'Moda'),
        ('zwierzeta', 'Zwierzęta'),
        ('rosliny', 'Rośliny'),
        ('zywnosc', 'Żywność'),
        ('zawody', 'Zawody'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    language_level = models.CharField(max_length=2, choices=LANGUAGE_LEVEL_CHOICES, default='a1')
    preferences = models.CharField(max_length=20, choices=PREFERENCES_CHOICES, default='sport')
    avatar = models.ImageField(upload_to='avatars/', default='/avatars/default_avatar.jpg')

    def __str__(self):
        return self.username

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='categories', null=True)

    class Meta:
        verbose_name = 'Kategoria'
        verbose_name_plural = 'Kategorie'

        constraints = [
            models.UniqueConstraint(fields=['owner', 'name'], name='unique_category_name'),
        ]

    def __str__(self):
        return f"{self.name} - {self.owner}"

class Flashcard(models.Model):
    ARTICLE_CHOICES = (
        ('der', 'der'),
        ('die', 'die'),
        ('das', 'das'),
    )

    COLOR_CHOICES = (
        ('niebieski', 'Niebieski'),
        ('czerwony', 'Czerwony'),
        ('zielony', 'Zielony'),
        ('żółty', 'Żółty'),
    )

    front = models.CharField(max_length=100)
    reverse = models.CharField(max_length=100)
    synonym = models.CharField(max_length=100, blank=True)
    plural = models.CharField(max_length=100, blank=True)
    article = models.CharField(max_length=100, choices=ARTICLE_CHOICES, blank=True)
    color = models.CharField(max_length=10, choices=COLOR_CHOICES, default='niebieski')
    example_sentence = models.TextField(blank=True)
    example_sentence_translation = models.TextField(blank=True)
    image = models.ImageField(upload_to='flashcard_images/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='flashcards')
    front_audio = models.FileField(upload_to='flashcard_audio/', blank=True, null=True)
    example_sentence_audio = models.FileField(upload_to='flashcard_audio/', blank=True, null=True)

    class Meta:
        verbose_name = 'Fiszka'
        verbose_name_plural = 'Fiszki'

        constraints = [
            models.UniqueConstraint(fields=['category', 'front'], name='unique_front_per_category'),
            models.UniqueConstraint(fields=['category', 'reverse'], name='unique_reverse_per_category'),
        ]

    def __str__(self):
        return f"{self.category}: {self.front} - {self.reverse}"

    def save(self, *args, **kwargs):
        if self.front and not self.front_audio:
            tts = gTTS(self.front, lang='de')
            buffer = BytesIO()
            tts.write_to_fp(buffer)
            buffer.seek(0)
            self.front_audio.save(f"{self.front}.mp3",
                            ContentFile(buffer.read()),
                            save=False)

        if self.example_sentence and not self.example_sentence_audio:
            tts = gTTS(self.example_sentence, lang='de')
            buffer = BytesIO()
            tts.write_to_fp(buffer)
            buffer.seek(0)
            self.example_sentence_audio.save(f"{self.front}-zdanie.mp3",
                            ContentFile(buffer.read()),
                            save=False)
        super().save(*args, **kwargs)
