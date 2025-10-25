from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.files.base import ContentFile
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from io import BytesIO

from django.db.models import ForeignKey
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

class QuizTopic(models.Model):

    LANGUAGE_LEVEL_CHOICES = (
        ('A1', 'A1'),
        ('A2', 'A2'),
        ('B1', 'B1'),
        ('B2', 'B2'),
        ('C1', 'C1'),
        ('C2', 'C2'),
    )

    TYPE_CHOICES = (
        ('słowictwo', 'Słownictwo'),
        ('gramatyka', 'Gramatyka'),
        ('mieszany', 'Mieszany'),
    )

    title = models.CharField(max_length=50, verbose_name='Tytuł quizu')
    description = models.TextField(verbose_name='Opis quizu')
    level = models.CharField(max_length=2, choices=LANGUAGE_LEVEL_CHOICES, verbose_name='Poziom zaawansowania')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name='Typ')
    image = models.ImageField(upload_to='quiz_images/', blank=True, null=True, verbose_name='Miniaturka')
    passing_score = models.PositiveIntegerField(default=60, validators=[MinValueValidator(0), MaxValueValidator(100)], verbose_name='Wynik potrzebny do zaliczenia (%)')
    number_of_questions = models.PositiveIntegerField(default=10, validators=[MinValueValidator(0), MaxValueValidator(100)], verbose_name='Ilość pytań')

    class Meta:
        verbose_name = 'Temat quizu'
        verbose_name_plural = 'Tematy quizów'

    def __str__(self):
        return f"{self.title} ({self.level})"


class Question(models.Model):
    TYPE_CHOICES = (
        ('single', 'Jednokrotny wybór'),
        ('multiple', 'Wielokrotny wybór'),
    )

    quiz = models.ForeignKey(QuizTopic, on_delete=models.CASCADE, related_name='questions', verbose_name="Quiz")
    question_text = models.CharField(verbose_name="Treść pytania (PL)")
    question_text_de = models.CharField(verbose_name="Treść pytania (DE)", blank=True, null=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='single', verbose_name="Typ")
    explanation = models.TextField(verbose_name="Wyjaśnienie", blank=True, null=True)

    class Meta:
        verbose_name = "Pytanie"
        verbose_name_plural = "Pytania"

    def __str__(self):
        return f"{self.question_text[:20]}... - ({self.type})"


class Answer(models.Model):
    LABEL_CHOICES = (
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('E', 'E'),
        ('F', 'F'),
    )

    label = models.CharField(max_length=1, choices=LABEL_CHOICES, default='A', verbose_name="Etykieta")
    text = models.TextField(verbose_name="Treść odpowiedzi")
    is_correct = models.BooleanField(default=False, verbose_name="Czy poprawna")
    order = models.PositiveIntegerField(default=0, verbose_name="Kolejność")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='question', null=True)

    class Meta:
        verbose_name = "Odpowiedź"
        verbose_name_plural = "Odpowiedzi"
        ordering = ['order', 'label']

        # constraints = [
        #     models.UniqueConstraint(fields=['question', 'label'], name='unique_question_answer'),
        # ]

    def __str__(self):
        return f"{self.label}. {self.text[:20]}..."


class QuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts', null=True)
    quiz = models.ForeignKey(QuizTopic, on_delete=models.CASCADE, related_name='quiz_attempts')
    score = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='wynik (%)')
    started_at = models.DateTimeField(auto_now_add=True, verbose_name='Rozpoczęto')
    completed_at = models.DateTimeField(blank=True, null=True, verbose_name='Ukończono')

    class Meta:
        verbose_name = "Podejście do quizu"
        verbose_name_plural = "Podejścia do quizów"
        ordering = ['started_at']

    def __str__(self):
        return f"{self.user.username} - {self.quiz} - {self.score}%"

class RecentQuiz(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='recent_quiz'
    )
    quiz_topic_id = models.IntegerField()
    quiz_topic_title = models.CharField(max_length=255)
    quiz_topic_image = models.URLField(max_length=500, blank=True, null=True)
    quiz_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'recent_quiz'
        verbose_name = 'Recent Quiz'
        verbose_name_plural = 'Recent Quizzes'

    def __str__(self):
        return f"{self.user.username} - {self.quiz_topic_title}"