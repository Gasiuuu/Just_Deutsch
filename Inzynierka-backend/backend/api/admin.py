from django.contrib import admin

from .models import CustomUser, Category, Flashcard, QuizTopic, Question, Answer

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Category)
admin.site.register(Flashcard)
admin.site.register(QuizTopic)
admin.site.register(Question)
admin.site.register(Answer)