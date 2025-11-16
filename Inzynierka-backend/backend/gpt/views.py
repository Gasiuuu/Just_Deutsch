import json
import uuid
from datetime import timedelta, datetime

import openai
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Prompt
from .serializers import GapFillSerializer, TranslateSerializer, DailyChallengeListSerializer
from .models import DailyChallenge, UserStreak
from .serializers import DailyChallengeSerializer, SubmitChallengeSerializer, UserStreakSerializer

# Create your views here.

openai.api_key = settings.GPT_API_KEY

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_sentence1(request):
    user = request.user
    category = request.data.get('category')
    level = getattr(user, 'language_level', None)

    if level not in dict(Prompt.LANGUAGE_LEVEL_CHOICES):
        return Response({"detail": "Nieprawidłowy poziom językowy"}, status=status.HTTP_400_BAD_REQUEST)

    prompt_text = (
        f"Utwórz przykładowe zdanie w języku niemieckim na poziomie {level} o tematyce '{category}',"
        " w którym trzeba wstawić brakujący rzeczownik/odmieniony czasownik lub rodzajnik."
        "Na końcu sentence (niemieckiego zdania) dodaj też podpowiedź w języku polskim w odpowiedniej formie, która jest odpowiednikiem niemieckiego missing_world."
        "Utwórz inne unikalne zdanie niż poprzednio, różne pod względem słownictwa i konstrukcji."
        "Odpowiedz dokładnie w przedstawionym formacie JSON:\n"
        "{\n"
        '   "sentence": "...",\n'
        '   "missing_world": "...",\n'
        '   "solution": "pełne zdanie"\n'
        "}"
    )

    Prompt.objects.create(user=user, level=level, text=prompt_text)

    try:
        response = openai.chat.completions.create(
            model = "gpt-4.1",
            messages = [{"role": "user", "content": prompt_text}],
            temperature = 1,
        )
        content = response.choices[0].message.content.strip()
        data = json.loads(content)
    except Exception as e:
        return Response({"detail": f"Wystąpił błąd podczas komunikacji z OpenAI: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = GapFillSerializer(data=data)
    if not serializer.is_valid():
        return Response({"details": "Format promptu jest niepoprawny", "errors": serializer.errors}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_sentence2(request):
    user = request.user
    category = request.data.get('category')
    print(category)
    level = getattr(user, 'language_level', None)

    if level not in dict(Prompt.LANGUAGE_LEVEL_CHOICES):
        return Response({"detail": "Nieprawidłowy poziom językowy"}, status=status.HTTP_400_BAD_REQUEST)

    prompt_text = (
        f"Utwórz przykładowe zdanie w języku niemieckim na poziomie {level} o tematyce '{category}',"
        "które trzeba przedłumaczyć na język polski lub odwrotnie."
        "Utwórz inne unikalne zdanie niż poprzednio, różne pod względem słownictwa i konstrukcji."
        "Odpowiedz dokładnie w przedstawionym formacie JSON:\n"
        "{\n"
        '   "sentence": "...",\n'
        '   "solution": "pełne zdanie w odwrotnym języku"\n'
        "}"
    )

    Prompt.objects.create(user=user, level=level, text=prompt_text)

    try:
        response = openai.chat.completions.create(
            model = "gpt-4.1",
            messages = [{"role": "user", "content": prompt_text}],
            temperature = 1,
        )
        content = response.choices[0].message.content.strip()
        data = json.loads(content)
    except Exception as e:
        return Response({"detail": f"Wystąpił błąd podczas komunikacji z OpenAI: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = TranslateSerializer(data=data)
    if not serializer.is_valid():
        return Response({"details": "Format promptu jest niepoprawny", "errors": serializer.errors}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_dialogue(request):
    user = request.user
    word = request.data
    # print(word)
    if not word:
        return Response({"detail": "Brak słowa do wygenerowania dialogu"})

    prompt_text = (
        f"Utwórz krótki dialog w języku niemieckim, "
        f"w którym słowo {word} wystąpi maksymalnie dwa razy (chodzi o użycie słowa w ceku pokazania kontesktu)."
        f"Dialog ma mieć długość 4-6 wypowiedzi. Każda wypowiedź ma zaczynać się imieniem i dwukropkiem"
        f"Masz też zwróćić przetłumaczone na polski odpowiedzi linii dialogu."
        f"Przetłumaczone linie nie mają mieć już imion osób uczestniczących w dialogu, tylko przetłumaczone ich wypowiedzi"
        f"Odpowiedź ma być tylko w formacie JSON: \n"
        "{\n"
        '   "word": "*słowo do dialogu*"'
        '   "lines": "["Name1: ...", "Name2: ...", "..."]"'
        '   "translatedLines": "["Name1: ...", "Name2: ...", "..."]"'

    )

    Prompt.objects.create(user=user, text=prompt_text)

    try:
        response = openai.chat.completions.create(
            model = "gpt-4.1",
            messages = [{"role": "user", "content": prompt_text}],
            temperature = 1,
        )
        content = response.choices[0].message.content.strip()
        data = json.loads(content)
        
    except Exception as e:
        return Response({"detail": f"Wystąpił błąd podczas komunikacji z OpenAI: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST)

    return Response(data, status=status.HTTP_200_OK)


def get_level_guidelines(level):
    """Zwraca wytyczne dla danego poziomu językowego"""
    guidelines = {
        'A1': 'Sehr einfache Sätze, Präsens, grundlegende Wörter (Familie, Essen, Zahlen)',
        'A2': 'Einfache Sätze, Präsens und Perfekt, Alltagssituationen',
        'B1': 'Mittlere Komplexität, verschiedene Zeitformen, Nebensätze erlaubt',
        'B2': 'Komplexere Strukturen, idiomatische Ausdrücke, abstrakte Themen',
        'C1': 'Anspruchsvolle Texte, Nuancen, Stilistik, komplexe Grammatik',
        'C2': 'Muttersprachliches Niveau, literarische Texte, feine Unterschiede'
    }
    return guidelines.get(level, guidelines['A2'])


def generate_daily_challenge_prompt(user):
    level = getattr(user, 'language_level', None)

    if level not in dict(Prompt.LANGUAGE_LEVEL_CHOICES):
        return Response({"detail": "Nieprawidłowy poziom językowy"}, status=status.HTTP_400_BAD_REQUEST)

    preferences = user.preferences.all()
    preference_names = [pref.label for pref in preferences] if preferences.exists() else ['Allgemein']

    prompt = f"""Du bist ein Experte für Deutschunterricht. Erstelle ein tägliches Lernpaket für einen Schüler.

    SCHÜLERPROFIL:
    - Sprachniveau: {level}
    - Präferenzen: {', '.join(preference_names)}
    - Lernziel: allgemein

    AUFGABE:
    Generiere genau 3 verschiedene Übungen in folgendem JSON-Format. Die Übungen sollten abwechslungsreich und dem Niveau angemessen sein.

    WICHTIG:
    - Alle Inhalte auf Deutsch (außer Übersetzungen und Erklärungen auf Polnisch)
    - Niveau: {level} - {get_level_guidelines(level)}
    - Alltagsrelevante, praktische Beispiele
    - Klare, präzise Erklärungen auf Polnisch
    - JSON muss valid sein (keine trailing commas, proper escaping)

    AUSGABEFORMAT (EXAKT DIESES JSON-SCHEMA):

    {{
      "tasks": [
        {{
          "type": "quiz",
          "order": 1,
          "points": 20,
          "topic": "Kurzer Themenname",
          "content": {{
            "question": "Frage auf Deutsch",
            "options": [
              {{ "id": "a", "text": "Option A" }},
              {{ "id": "b", "text": "Option B" }},
              {{ "id": "c", "text": "Option C" }},
              {{ "id": "d", "text": "Option D" }}
            ],
            "correctAnswer": "a",
            "explanation": "Wyjaśnienie po polsku dlaczego ta odpowiedź jest poprawna"
          }}
        }},
        {{
          "type": "translation",
          "order": 2,
          "points": 30,
          "topic": "Kurzer Themenname",
          "content": {{
            "direction": "de-to-pl",
            "sentence": "Praktisches Beispielsatz auf Deutsch",
            "correctTranslation": "Poprawne tłumaczenie na polski",
            "alternatives": [
              "Alternatywne poprawne tłumaczenie (jeśli istnieje)"
            ],
            "hint": "Wskazówka po polsku",
            "vocabulary": [
              {{ "word": "słowo", "translation": "tłumaczenie" }},
              {{ "word": "inne słowo", "translation": "tłumaczenie" }}
            ]
          }}
        }},
        {{
          "type": "gap-fill",
          "order": 3,
          "points": 25,
          "topic": "Kurzer Themenname",
          "content": {{
            "sentence": "Satz mit ___ Lücken ___ zum Ausfüllen",
            "gaps": [
              {{
                "position": 1,
                "options": ["Option1", "Option2", "Option3", "Option4"],
                "correctAnswer": "Option1",
                "explanation": "Wyjaśnienie po polsku"
              }},
              {{
                "position": 2,
                "options": ["Option1", "Option2", "Option3", "Option4"],
                "correctAnswer": "Option2",
                "explanation": "Wyjaśnienie po polsku"
              }}
            ],
            "fullSentence": "Vollständiger Satz mit allen ausgefüllten Lücken",
            "translation": "Tłumaczenie całego zdania na polski"
          }}
        }}
      ],
      "metadata": {{
        "difficulty": "{level}",
        "estimatedTime": 8,
        "topics": ["temat1", "temat2", "temat3"]
      }}
    }}

    REGELN FÜR ÜBUNGEN:

    Quiz:
    - Frage soll klar und eindeutig sein
    - Eine Distractor-Antwort sollte ein häufiger Fehler sein
    - Themen: Grammatik, Wortschatz, oder Kultur
    - Beispiele: Verbkonjugation, Artikel, Präpositionen, Wortstellung

    Translation:
    - Satz sollte praktisch und alltagsrelevant sein
    - 8-15 Wörter optimal
    - Bei {level}: {get_level_guidelines(level)}
    - 2-3 Schlüsselwörter im vocabulary-Array hervorheben

    Gap-Fill:
    - 2 Lücken pro Satz optimal
    - Fokus auf: Artikel, Präpositionen, Verbformen, oder Adjektivendungen
    - Jede Option sollte grammatikalisch plausibel aussehen
    - Reihenfolge der Optionen: nicht zu offensichtlich

    Generiere jetzt das JSON:"""

    return prompt


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def generate_daily_challenge(request):
    user = request.user
    level = getattr(user, 'language_level', None)

    if level not in dict(Prompt.LANGUAGE_LEVEL_CHOICES):
        return Response(
            {"detail": "Nieprawidłowy poziom językowy"},
            status=status.HTTP_400_BAD_REQUEST
        )

    today = timezone.now().date()

    existing_challenge = DailyChallenge.objects.filter(
        user=user,
        date=today
    ).first()

    if existing_challenge:
        if request.method == 'GET':
            serializer = DailyChallengeSerializer(existing_challenge)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Użytkownik ma już wygenerowany zestaw zadań na dzień dzisiejszy.'}, status=status.HTTP_400_BAD_REQUEST)

    prompt_text = generate_daily_challenge_prompt(user)

    Prompt.objects.create(
        user=user,
        level=level,
        text=prompt_text,
    )

    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "Du bist ein Experte für Deutschunterricht. Du erstellst präzise, lehrreiche Übungen. Antworte NUR mit validem JSON, ohne zusätzlichen Text."
                },
                {
                    "role": "user",
                    "content": prompt_text
                }
            ],
            temperature=0.7,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content.strip()
        data = json.loads(content)

    except json.JSONDecodeError as e:
        return Response(
            {"detail": f"Błąd parsowania JSON z OpenAI: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {"detail": f"Wystąpił błąd podczas komunikacji z OpenAI: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    tasks = data.get('tasks', [])

    for i, task in enumerate(tasks):
        task['id'] = str(uuid.uuid4())

    max_score = sum(task.get('points', 0) for task in tasks)

    tomorrow = today + timedelta(days=1)
    expires_at = timezone.make_aware(
        datetime.combine(tomorrow, datetime.min.time())
    )

    challenge_data = {
        'user': user.id,
        'date': today,
        'user_level': level,
        'expires_at': expires_at,
        'completed': False,
        'score': None,
        'max_score': max_score,
        'tasks': tasks,
        'metadata': {
            **data.get('metadata', {}),
            'generated_at': timezone.now().isoformat(),
            'generated_by': 'openai-gpt-4o'
        }
    }

    serializer = DailyChallengeSerializer(data=challenge_data)
    if not serializer.is_valid():
        return Response(
            {
                "detail": "Format wygenerowanych danych jest niepoprawny",
                "errors": serializer.errors
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    challenge = serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_daily_challenge_history(request):
    user = request.user
    limit = int(request.query_params.get('limit', 30))

    challenges = DailyChallenge.objects.filter(user=user).order_by('-date')[:limit]
    # serializer = DailyChallengeSerializer(challenges, many=True)
    serializer = DailyChallengeListSerializer(challenges, many=True)


    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_daily_challenge(request, challenge_id):
    user = request.user

    try:
        challenge = DailyChallenge.objects.get(id=challenge_id, user=user)
    except DailyChallenge.DoesNotExist:
        return Response(
            {"detail": "Wyzwanie nie zostało znalezione"},
            status=status.HTTP_404_NOT_FOUND
        )

    if challenge.completed:
        return Response(
            {"detail": "To wyzwanie zostało już ukończone"},
            status=status.HTTP_400_BAD_REQUEST
        )

    submit_serializer = SubmitChallengeSerializer(data=request.data)
    if not submit_serializer.is_valid():
        return Response(
            {"detail": "Nieprawidłowy format odpowiedzi", "errors": submit_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    answers = submit_serializer.validated_data['answers']

    results = []
    total_score = 0

    for answer in answers:
        task_id = answer.get('taskId')
        task_type = answer.get('type')
        user_answer = answer.get('answer')

        task = next((t for t in challenge.tasks if t.get('id') == task_id), None)

        if not task:
            continue

        task_result = evaluate_task(task, task_type, user_answer)
        results.append(task_result)
        total_score += task_result.get('points', 0)

    challenge.completed = True
    challenge.score = total_score
    challenge.completed_at = timezone.now()
    challenge.save()

    streak_info = update_user_streak(user, today=challenge.date)

    response_data = {
        'challenge_id': str(challenge.id),
        'completed': True,
        'total_score': total_score,
        'max_score': challenge.max_score,
        'percentage': round((total_score / challenge.max_score) * 100, 2) if challenge.max_score > 0 else 0,
        'streak_days': streak_info['streak_days'],
        'longest_streak': streak_info['longest_streak'],
        'results': results,
        'next_challenge': {
            'available_at': (challenge.date + timedelta(days=1)).isoformat(),
        }
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_streak(request):
    user = request.user

    streak, created = UserStreak.objects.get_or_create(user=user)

    serializer = UserStreakSerializer(streak)
    return Response(serializer.data, status=status.HTTP_200_OK)


def evaluate_task(task, task_type, user_answer):
    content = task.get('content', {})
    points = task.get('points', 0)

    if task_type == 'quiz':
        correct = content.get('correctAnswer') == user_answer
        return {
            'task_id': task.get('id'),
            'correct': correct,
            'points': points if correct else 0,
            'feedback': 'Świetnie!' if correct else f"Prawidłowa odpowiedź to: {content.get('correctAnswer')}"
        }

    elif task_type == 'translation':
        correct_translation = content.get('correctTranslation', '').lower().strip()
        alternatives = [alt.lower().strip() for alt in content.get('alternatives', [])]
        user_answer_lower = user_answer.lower().strip()

        correct = user_answer_lower == correct_translation or user_answer_lower in alternatives

        return {
            'task_id': task.get('id'),
            'correct': correct,
            'points': points if correct else 0,
            'feedback': 'Doskonałe tłumaczenie!' if correct else f"Poprawne tłumaczenie: {content.get('correctTranslation')}"
        }

    elif task_type == 'gap-fill':
        gaps = content.get('gaps', [])
        user_answers = user_answer if isinstance(user_answer, list) else [user_answer]

        correct_count = 0
        mistakes = []

        for i, gap in enumerate(gaps):
            if i < len(user_answers):
                is_correct = gap.get('correctAnswer') == user_answers[i]
                if is_correct:
                    correct_count += 1
                else:
                    mistakes.append({
                        'gap': gap.get('position'),
                        'your_answer': user_answers[i],
                        'correct_answer': gap.get('correctAnswer'),
                        'explanation': gap.get('explanation')
                    })

        partial_score = int((correct_count / len(gaps)) * points) if gaps else 0

        return {
            'task_id': task.get('id'),
            'correct': correct_count == len(gaps),
            'points': partial_score,
            'max_points': points,
            'partial_credit': True,
            'feedback': 'Wszystko poprawnie!' if correct_count == len(
                gaps) else f"Poprawnych: {correct_count}/{len(gaps)}",
            'mistakes': mistakes if mistakes else None
        }

    return {
        'task_id': task.get('id'),
        'correct': False,
        'points': 0,
        'feedback': 'Nieznany typ zadania'
    }


def update_user_streak(user, today=None):
    if today is None:
        today = timezone.now().date()

    yesterday = today - timedelta(days=1)

    streak, created = UserStreak.objects.get_or_create(user=user)

    if streak.last_completed_date == yesterday:
        streak.streak_days += 1
    elif streak.last_completed_date == today:
        pass
    else:
        streak.streak_days = 1

    if streak.streak_days > streak.longest_streak:
        streak.longest_streak = streak.streak_days

    streak.last_completed_date = today
    streak.total_challenges_completed += 1

    challenge = DailyChallenge.objects.filter(user=user, date=today, completed=True).first()
    if challenge and challenge.score:
        streak.total_points += challenge.score

    streak.save()

    return {
        'streak_days': streak.streak_days,
        'longest_streak': streak.longest_streak,
        'total_challenges_completed': streak.total_challenges_completed,
        'total_points': streak.total_points
    }
