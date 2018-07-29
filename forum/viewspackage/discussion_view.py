from django import forms
from django.http import JsonResponse
from knox.models import AuthToken
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response

from forum.models import *
from forum.serializers import *



@api_view(['GET', 'POST'])
def questions_list(request):
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
    if request.method == 'GET':
        question = Question.objects.all()
        serializer = QuestionDetailSerializer(question, many=True)
        return JsonResponse(serializer.data,safe=False)

    elif request.method == 'POST':
        serializer = QuestionDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CreateAnswerDetailJsonView(ListAPIView):
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
    serializer_class = AnswerDetailSerializer
    def get_queryset(self):
        answers = Answer.objects.filter(question__id=self.kwargs['question_id'])
        return answers


# class CreateQuestionDetailJsonView(ListAPIView):
#    # permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
#     serializer_class = QuestionDetailSerializer
#     def get_queryset(self):
#         questions = Question.objects.filter(question__id=self.kwargs['question_id'])
#         return questions



class CreateUserProfileJsonView(CreateAPIView):
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
    userprofile = UserProfile.objects.all
    serializer_class = UserProfileSerializer


class CreateQuestionJsonView(CreateAPIView):
   # permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
    queryset = Question.objects.all
    serializer_class = CreateQuestionSerializer


class CreateAnswerJsonView(CreateAPIView):
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
    queryset = Answer.objects.all
    serializer_class = CreateAnswerSerializer

    def get_serializer_context(self):
        return {"user_id": self.request.user.id, "question_id": self.kwargs["question_id"]}


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user