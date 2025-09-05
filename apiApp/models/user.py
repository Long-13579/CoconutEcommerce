from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    profile_picture_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.email
