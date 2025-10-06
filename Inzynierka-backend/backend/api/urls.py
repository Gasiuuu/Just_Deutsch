from django.urls import path
from .views import login_view, registration_view, admin_only_view, user_only_view, FlashcardViewSet, CategoryViewSet, \
    get_flashcards_by_category, me_view, logout_view, QuizTopicViewSet

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', registration_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('admin/', admin_only_view, name='admin'),
    path('user/', user_only_view, name='user'),
    path('me/', me_view, name='me' ),
    path('flashcards/', FlashcardViewSet.as_view({'get': 'list', 'post': 'create'}), name='flashcards'),
    path('flashcard/<int:pk>/', FlashcardViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='flashcard-details'),
    path('flashcards/<int:category_id>/', get_flashcards_by_category, name='flashcards-by-category'),
    path('categories/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='categories'),
    path('category/<int:pk>', CategoryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='category-details'),
    path('quiz-topics/', QuizTopicViewSet.as_view({'get': 'list', 'post': 'create'}), name='quiz-topics'),
]