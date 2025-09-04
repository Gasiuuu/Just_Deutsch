from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers

from .models import CustomUser, Category, Flashcard

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'date_joined', 'role', 'language_level', 'avatar', 'preferences')

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
    class Meta:
        model = Flashcard
        fields = ('id', 'front', 'reverse', 'synonym', 'plural', 'article', 'color', 'example_sentence', 'example_sentence_translation', 'image', 'category', 'front_audio', 'example_sentence_audio')

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