from rest_framework import serializers
from .models import DailyChallenge, UserStreak

class GapFillSerializer(serializers.Serializer):
    sentence = serializers.CharField(required=True)
    missing_world = serializers.CharField(required=True)
    solution = serializers.CharField(required=True)

class TranslateSerializer(serializers.Serializer):
    sentence = serializers.CharField(required=True)
    solution = serializers.CharField(required=True)

class DailyChallengeSerializer(serializers.ModelSerializer):
    tasks = serializers.JSONField()
    metadata = serializers.JSONField()
    percentage = serializers.ReadOnlyField()

    class Meta:
        model = DailyChallenge
        fields = [
            'id',
            'user',
            'date',
            'user_level',
            'completed',
            'score',
            'max_score',
            'percentage',
            'tasks',
            'metadata',
            'created_at',
            'expires_at',
            'completed_at',
        ]
        read_only_fields = ['id', 'created_at', 'percentage']

    def validate_tasks(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Tasks musi być listą")

        if len(value) == 0:
            raise serializers.ValidationError("Tasks nie może być pustą listą")

        required_fields = ['type', 'order', 'points', 'topic', 'content']
        valid_types = ['quiz', 'translation', 'gap-fill']

        for i, task in enumerate(value):
            for field in required_fields:
                if field not in task:
                    raise serializers.ValidationError(
                        f"Zadanie #{i + 1}: brakuje pola '{field}'"
                    )

            if task['type'] not in valid_types:
                raise serializers.ValidationError(
                    f"Zadanie #{i + 1}: nieprawidłowy typ '{task['type']}'"
                )

        return value

    def validate_metadata(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Metadata musi być obiektem")

        required_fields = ['difficulty', 'estimatedTime', 'topics']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Metadata: brakuje pola '{field}'")

        return value

class DailyChallengeListSerializer(serializers.ModelSerializer):
    percentage = serializers.ReadOnlyField()
    topics = serializers.SerializerMethodField()

    class Meta:
        model = DailyChallenge
        fields = [
            'id',
            'date',
            'user_level',
            'completed',
            'score',
            'max_score',
            'percentage',
            'topics',
            'expires_at',
        ]

    def get_topics(self, obj):
        return obj.metadata.get('topics', [])

class UserStreakSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserStreak
        fields = [
            'username',
            'streak_days',
            'longest_streak',
            'last_completed_date',
            'total_challenges_completed',
            'total_points',
            'updated_at',
        ]
        read_only_fields = ['username', 'updated_at']

class SubmitAnswerSerializer(serializers.Serializer):
    taskId = serializers.CharField()
    type = serializers.ChoiceField(choices=['quiz', 'translation', 'gap-fill'])
    answer = serializers.JSONField()


class SubmitChallengeSerializer(serializers.Serializer):
    answers = SubmitAnswerSerializer(many=True)

    def validate_answers(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("Lista odpowiedzi nie może być pusta")
        return value
