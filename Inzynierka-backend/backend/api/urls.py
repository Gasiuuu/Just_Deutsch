from django.urls import path
from .views import login_view, registration_view, admin_only_view, user_only_view, FlashcardViewSet, CategoryViewSet, \
    get_flashcards_by_category, me_view, logout_view, QuizTopicViewSet, QuestionViewSet, get_questions_by_quiz, \
    AnswerViewSet, get_answers_by_question, create_quiz_attempt, get_recent_quiz, set_recent_quiz, CustomUserViewSet

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', registration_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('admin/', admin_only_view, name='admin'),
    path('user/', user_only_view, name='user'),
    path('edit-user/<int:pk>', CustomUserViewSet.as_view({'patch': 'partial_update'}), name='edit-user'),
    path('me/', me_view, name='me' ),
    path('flashcards/', FlashcardViewSet.as_view({'get': 'list', 'post': 'create'}), name='flashcards'),
    path('flashcard/<int:pk>/', FlashcardViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='flashcard-details'),
    path('flashcards/<int:category_id>/', get_flashcards_by_category, name='flashcards-by-category'),
    path('categories/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='categories'),
    path('category/<int:pk>', CategoryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='category-details'),
    path('quiz-topics/', QuizTopicViewSet.as_view({'get': 'list', 'post': 'create'}), name='quiz-topics'),
    path('quiz-topic/<int:pk>', QuizTopicViewSet.as_view({'get': 'retrieve'}), name='quiz-topics'),
    path('questions/', QuestionViewSet.as_view({'get': 'list', 'post': 'create'}), name='question'),
    path('questions/<int:quiz_id>', get_questions_by_quiz, name='questions-by-quiz'),
    path('answers/', AnswerViewSet.as_view({'get': 'list', 'post': 'create'}), name='answers'),
    path('answers/<int:question_id>', get_answers_by_question, name='answers-by-question'),
    path('quiz/<int:quiz_id>/attempt', create_quiz_attempt, name='create-quiz-attempt'),
    path('recent-quiz/', get_recent_quiz, name='get_recent_quiz'),
    path('recent-quiz/set/', set_recent_quiz, name='set_recent_quiz'),
]