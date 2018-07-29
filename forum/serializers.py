from django.contrib.auth import authenticate
from rest_framework import serializers
from forum.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name','last_name','username','password')
        extra_kwargs = {'password': {'write_only': True}}

    # def create(self, validated_data):
    #     user = User.objects.create_user(**validated_data,)
    #     return user


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('first_name','last_name','username','id','password',)


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = UserProfile
        fields = ('user','location',)
    def create(self,validated_data):
        userdata = validated_data.pop('user')
        user = User.objects.create_user(**userdata)
        profile = UserProfile.objects.create(**validated_data,user=user)
        return profile


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'


class QuestionDetailSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer()
    class Meta:
        model= Question
        fields=['id','title','description','user_profile',]
    def create(self,validated_data):
        user_profiledata = validated_data.pop('user_profile')
        user_profile = UserProfile.objects.create(**user_profiledata)
        questiondetail = Question.objects.create(**validated_data,)
        return questiondetail


class AnswerDetailSerializer(serializers.ModelSerializer):
    user_profile=UserProfileSerializer()
    question=QuestionDetailSerializer()
    class Meta:
        model=Answer
        fields=["id","user_profile","question","description"]
    def create(self,validated_data):
        user_profiledata = validated_data.pop('user_profile')
        user_profile = UserProfile.objects.create(**user_profiledata)
        questiondata = validated_data.pop('question')
        question = Question.objects.create(**questiondata)
        answerdetail = Answer.objects.create(**validated_data,)
        return answerdetail


class CreateQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Question
        fields=["title","description"]
    def create(self, validated_data):
        user_id=self.context['request'].user.id
        user_profile=UserProfile.objects.get(user_id=user_id)
        question=Question.objects.create(user_profile=user_profile,**validated_data,)
        return question


class CreateAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Answer
        fields=["description"]
    def create(self, validated_data):
        user_id=self.context['user_id']
        user_profile=UserProfile.objects.get(user_id=user_id)
        question_id = self.context['question_id']
        question=Question.objects.get(id=question_id)
        answer=Answer.objects.create(question=question,**validated_data,user_profile=user_profile)
        return answer