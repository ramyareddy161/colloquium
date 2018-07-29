from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    location = models.CharField(max_length=10)
    #avatar = models.URLField()
    karma = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username



class Question(models.Model):
    title = models.CharField (max_length=500)
    description = models.CharField(max_length=5000)

    user_profile = models.ForeignKey(UserProfile,on_delete=models.CASCADE)

    def __str__(self):
        return self.title



class Answer(models.Model):
    description = models.CharField(max_length=5000)

    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def __str__(self):
        return self.description