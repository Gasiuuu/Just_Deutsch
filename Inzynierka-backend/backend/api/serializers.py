from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers

from .models import CustomUser, Category, Flashcard, QuizTopic, Question, Answer, QuizAttempt, RecentQuiz, Preference, \
    RecentFlashcardSet

User = get_user_model()

class PreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preference
        fields = ('id', 'label')

class CustomUserSerializer(serializers.ModelSerializer):
    preferences = PreferenceSerializer(many=True, read_only=True)
    preference_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Preference.objects.all(),
        source='preferences',
        required=False,
        write_only=True
    )

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'date_joined', 'role', 'language_level', 'avatar',
                  'preferences', 'preference_ids')
        read_only_fields = ('id', 'date_joined')


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            data['user'] = user
            return data
        raise serializers.ValidationError("Nieprawidłowe dane logowania")


class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    language_level = serializers.ChoiceField(choices=CustomUser.LANGUAGE_LEVEL_CHOICES, required=True)
    password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'language_level')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            language_level=validated_data['language_level'],
        )
        return user

class CategorySerializer(serializers.ModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'image', 'owner')

class FlashcardSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Flashcard
        fields = ('id', 'front', 'reverse', 'synonym', 'plural', 'article', 'color', 'example_sentence', 'example_sentence_translation', 'image', 'category', 'front_audio', 'example_sentence_audio')

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    # def validate(self, category):
    #     user = self.context.get('request').user
    #     if category.owner != user and not (user.is_staff or user.is_superuser):
    #         raise serializers.ValidationError("Nie możesz dodawać fiszek do cudzej kategorii")
    #     return category

    def validate(self, attrs):
        user = self.context['request'].user
        category = attrs.get('category') or getattr(self.instance, 'category', None)

        if category is None:
            raise serializers.ValidationError("Wymagana kategoria.")

        if user.is_staff or user.is_superuser:
            return attrs

        if category.owner != user:
            return serializers.ValidationError("Nie masz dostępu do cudzej kategorii.")

        return attrs

class QuizTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizTopic
        fields = ('id', 'title', 'description', 'level', 'type', 'image', 'passing_score', 'number_of_questions')



class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('id', 'label', 'text', 'is_correct', 'order', 'question')


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        quiz = serializers.PrimaryKeyRelatedField(read_only=True)
        model = Question
        fields = ('id', 'quiz', 'question_text', 'question_text_de', 'type', 'explanation')


class QuizAttemptSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    quiz = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ('user', 'quiz', 'score')


class RecentQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentQuiz
        fields = ['quiz_topic_id', 'quiz_topic_title', 'quiz_topic_image', 'quiz_score']

    def create(self, validated_data):
        user = validated_data.pop('user')  # Pobierz usera z validated_data
        obj, created = RecentQuiz.objects.update_or_create(
            user=user,
            defaults=validated_data
        )
        return obj

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class RecentFlashcardSetSerializer(serializers.ModelSerializer):
    flashcard_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    flashcards = FlashcardSerializer(many=True, read_only=True)

    class Meta:
        model = RecentFlashcardSet
        fields = ['category_id', 'category_name', 'category_image', 'flashcards_length', 'last_index', 'flashcard_ids',
                  'flashcards']

    def create(self, validated_data):
        flashcard_ids = validated_data.pop('flashcard_ids', [])
        user = self.context['request'].user

        obj, created = RecentFlashcardSet.objects.update_or_create(
            user=user,
            defaults=validated_data
        )

        if flashcard_ids:
            flashcards = Flashcard.objects.filter(id__in=flashcard_ids)
            obj.flashcards.set(flashcards)

        return obj

    def update(self, instance, validated_data):
        flashcard_ids = validated_data.pop('flashcard_ids', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if flashcard_ids is not None:
            flashcards = Flashcard.objects.filter(id__in=flashcard_ids)
            instance.flashcards.set(flashcards)

        return instance