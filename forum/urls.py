from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

from forum.viewspackage.discussion_view import *

app_name="forum"


urlpatterns=[
    path('templateview/', TemplateView.as_view(template_name="index.html")),
    path("api/auth/register/", RegistrationAPI.as_view()),
    path("api/auth/login/", LoginAPI.as_view()),
    path("api/auth/user/", UserAPI.as_view()),
    path("api/questions/",questions_list),
    path("api/questions/<int:question_id>/",CreateAnswerDetailJsonView.as_view()),
    path("api/adduser/",CreateUserProfileJsonView.as_view()),
    path("api/questions/addquestion/", CreateQuestionJsonView.as_view()),
    path("api/questions/<int:question_id>/addanswer/", CreateAnswerJsonView.as_view()),
]