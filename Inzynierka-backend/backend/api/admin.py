from django.contrib import admin

from .models import CustomUser, Category, Flashcard, QuizTopic

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Category)
admin.site.register(Flashcard)
admin.site.register(QuizTopic)