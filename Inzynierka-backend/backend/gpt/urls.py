from django.urls import path
from .views import generate_sentence1, generate_sentence2, generate_dialogue, generate_daily_challenge, \
    get_daily_challenge_history, submit_daily_challenge, get_user_streak

urlpatterns = [
    path('generate-sentence1/', generate_sentence1, name='generate-sentence1'),
    path('generate-sentence2/', generate_sentence2, name='generate-sentence2'),
    path('generate_dialogue/', generate_dialogue, name='generate_dialogue'),
    # path('generate-question/', generate_question, name='generate-question'),
    path('daily-challenge/', generate_daily_challenge, name='generate_daily_challenge'),
    path('daily-challenge/history/', get_daily_challenge_history, name='daily_challenge_history'),
    path('daily-challenge/<uuid:challenge_id>/submit/', submit_daily_challenge, name='submit_daily_challenge'),
    path('user/streak/', get_user_streak, name='get_user_streak'),
]