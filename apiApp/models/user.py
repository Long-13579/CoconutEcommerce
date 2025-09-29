from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)  # allow spaces, not unique
    profile_picture_url = models.URLField(blank=True, null=True)
    role = models.ForeignKey('apiApp.Role', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    is_staff_account = models.BooleanField(default=False)  # True for staff, False for customers
    created_at = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    # Remove unnecessary fields from DB
    first_name = None
    last_name = None
    is_staff = None
