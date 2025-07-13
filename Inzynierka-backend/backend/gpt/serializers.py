from rest_framework import serializers

class GapFillSerializer(serializers.Serializer):
    sentence = serializers.CharField(required=True)
    missing_world = serializers.CharField(required=True)
    solution = serializers.CharField(required=True)

class TranslateSerializer(serializers.Serializer):
    sentence = serializers.CharField(required=True)
    solution = serializers.CharField(required=True)