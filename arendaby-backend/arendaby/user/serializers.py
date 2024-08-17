from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    username = serializers.CharField(max_length=20)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile', ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20)
    firstname = serializers.CharField(max_length=20)
    secondname = serializers.CharField(max_length=20)
    phone = serializers.CharField(max_length=20)
    image = serializers.ImageField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def save(self, **kwargs):
        if User.objects.filter(username=self.validated_data['username']).exists():
            raise serializers.ValidationError('User with this username already exists')
        if User.objects.filter(email=self.validated_data['email']).exists():
            raise serializers.ValidationError('User with this email already exists')
        user = User.objects.create_user(**self.validated_data)
        UserProfile.objects.create(user=user)
        return user


class UserTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_id = User.objects.get(username=user.username).id
        token['user_id'] = user_id
        return token
