import json

import openai
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Prompt
from .serializers import GapFillSerializer, TranslateSerializer

# Create your views here.

openai.api_key = settings.GPT_API_KEY

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_sentence1(request):
    user = request.user
    level = getattr(user, 'language_level', None)

    if level not in dict(Prompt.LANGUAGE_LEVEL_CHOICES):
        return Response({"detail": "Nieprawidłowy poziom językowy"}, status=status.HTTP_400_BAD_REQUEST)

    prompt_text = (
        f"Utwórz przykładowe zdanie w języku niemieckim na poziomie {level},"
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
    level = getattr(user, 'language_level', None)

    if level not in dict(Prompt.LANGUAGE_LEVEL_CHOICES):
        return Response({"detail": "Nieprawidłowy poziom językowy"}, status=status.HTTP_400_BAD_REQUEST)

    prompt_text = (
        f"Utwórz przykładowe zdanie w języku niemieckim na poziomie {level},"
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