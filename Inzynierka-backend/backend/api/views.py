from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils import timezone

from .models import CustomUser, Category, Flashcard, QuizTopic, Question, Answer, QuizAttempt, RecentQuiz, Preference, \
    RecentFlashcardSet
from .serializers import LoginSerializer, RegisterSerializer, CustomUserSerializer, CategorySerializer, \
    FlashcardSerializer, QuizTopicSerializer, QuestionSerializer, AnswerSerializer, QuizAttemptSerializer, \
    RecentQuizSerializer, PreferenceSerializer, RecentFlashcardSetSerializer
from django.conf import settings


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    # queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Category.objects.all()

        if user.is_staff or user.is_superuser:
            return queryset

        if self.request.method in SAFE_METHODS:
            return queryset.filter(Q(owner=user) | Q(owner__is_staff=True) | Q(owner__is_superuser=True))

        return queryset.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class FlashcardViewSet(viewsets.ModelViewSet):
    # queryset = Flashcard.objects.select_related('category').all()
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Flashcard.objects.select_related('category')

        if user.is_staff or user.is_superuser:
            return queryset

        if self.request.method in SAFE_METHODS:
            return queryset.filter(Q(category__owner=user) | Q(category__owner__is_staff=True) | Q(category__owner__is_superuser=True))

        return queryset.filter(owner=user)

class QuizTopicViewSet(viewsets.ModelViewSet):
    queryset = QuizTopic.objects.all()
    serializer_class = QuizTopicSerializer
    permission_classes = [IsAuthenticated]

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

def set_jwt_token(response, access_token, refresh_token):
    access_max_age = int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
    refresh_max_age = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())

    response.set_cookie(
        key='access',
        value=access_token,
        max_age=access_max_age,
        httponly=True,
        secure=False,
        samesite='Lax',
        path='/'
    )

    response.set_cookie(
        key='refresh',
        value=refresh_token,
        max_age=refresh_max_age,
        httponly=True,
        secure=False,
        samesite='Lax',
        path='/'
    )

@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        user_data = CustomUserSerializer(user).data
        response = Response({"message": "Zalogowano pomyślnie", "user": user_data}, status=status.HTTP_200_OK)

        set_jwt_token(response, str(refresh.access_token), str(refresh))
        return response

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    raw_token = request.COOKIES.get('refresh')
    if raw_token:
        try:
            token = RefreshToken(raw_token)
            token.blacklist()
        except TokenError:
            pass

    response = Response({"message": "Wylogowano pomyślnie"}, status=status.HTTP_200_OK)
    response.delete_cookie('access', path='/', samesite='Lax')
    response.delete_cookie('refresh', path='/', samesite='Lax')
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def registration_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Rejestracja przebiegła pomyślnie"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    user_data = CustomUserSerializer(user).data
    return Response(user_data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_preferences(request):
    preferences = Preference.objects.all()
    serializer = PreferenceSerializer(preferences, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_flashcards_by_category(request, category_id):
    user = request.user
    # category = Category.objects.filter(pk=category_id)
    category = get_object_or_404(Category.objects.select_related('owner'), id=category_id)

    if not (user.is_staff or user.is_superuser or
            category.owner == user or
            (category.owner and (category.owner.is_staff or category.owner.is_superuser))):
        return Response(status=status.HTTP_404_NOT_FOUND)

    flashcards = category.flashcards.all()
    serializer = FlashcardSerializer(flashcards, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_questions_by_quiz(request, quiz_id):
    quiz = QuizTopic.objects.get(id=quiz_id)
    questions = Question.objects.filter(quiz=quiz)
    serializer = QuestionSerializer(questions, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_answers_by_question(request, question_id):
    question = Question.objects.get(id=question_id)
    answers = Answer.objects.filter(question=question)
    serializer = AnswerSerializer(answers, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_quiz(request):
    try:
        recent_quiz = RecentQuiz.objects.get(user=request.user)
        serializer = RecentQuizSerializer(recent_quiz)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except RecentQuiz.DoesNotExist:
        return Response(
            {'message': 'No recent quiz found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_recent_quiz(request):
    try:
        recent_quiz = RecentQuiz.objects.get(user=request.user)
        serializer = RecentQuizSerializer(
            recent_quiz,
            data=request.data,
            partial=True,
            context={'request': request}
        )
    except RecentQuiz.DoesNotExist:
        serializer = RecentQuizSerializer(
            data=request.data,
            context={'request': request}
        )

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_flashcard_set(request):
    try:
        recent_flashcard_set = RecentFlashcardSet.objects.get(user=request.user)
        serializer = RecentFlashcardSetSerializer(recent_flashcard_set, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except RecentFlashcardSet.DoesNotExist:
        return Response(
            {},
            status=status.HTTP_200_OK
        )


@api_view(['POST', 'PATCH'])
@permission_classes([IsAuthenticated])
def set_recent_flashcard_set(request):
    try:
        recent_flashcard_set = RecentFlashcardSet.objects.get(user=request.user)
        serializer = RecentFlashcardSetSerializer(
            recent_flashcard_set,
            data=request.data,
            partial=True,
            context={'request': request}
        )
    except RecentFlashcardSet.DoesNotExist:
        serializer = RecentFlashcardSetSerializer(
            data=request.data,
            context={'request': request}
        )

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_quiz_attempt(request, quiz_id):
    try:
        quiz = QuizTopic.objects.get(id=quiz_id)
    except QuizTopic.DoesNotExist:
        return Response({'error': 'Quiz nie istnieje.'}, status=status.HTTP_404_NOT_FOUND)

    score = request.data.get('score')

    if score is None:
        return Response({'error': 'Brak wyniku.'}, status=status.HTTP_400_BAD_REQUEST)

    attempt = QuizAttempt.objects.create(
        user=request.user,
        quiz=quiz,
        score=score,
        completed_at=timezone.now()
    )

    serializer = QuizAttemptSerializer(attempt)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


def role_required(role):
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            if not hasattr(request.user, 'role') or request.user.role != role:
                return Response({'error': 'Brak uprawnień'}, status=status.HTTP_403_FORBIDDEN)
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@role_required('admin')
def admin_only_view(request):
    return Response({"message": "Witaj, admin!"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@role_required('user')
def user_only_view(request):
    return Response({"message": "Witaj, użytkowniku!"}, status=status.HTTP_200_OK)

