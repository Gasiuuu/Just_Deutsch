from django.urls import path
from .views import generate_sentence1, generate_sentence2, generate_dialogue

urlpatterns = [
    path('generate-sentence1/', generate_sentence1, name='generate-sentence1'),
    path('generate-sentence2/', generate_sentence2, name='generate-sentence2'),
    path('generate_dialogue/', generate_dialogue, name='generate_dialogue'),
]