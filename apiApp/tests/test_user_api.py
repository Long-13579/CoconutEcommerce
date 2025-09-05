from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from django.urls import reverse

User = get_user_model()

class UserAPITestCase(APITestCase):
    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "profile_picture_url": "https://example.com/avatar.png",
        }

    def test_create_user(self):
        url = reverse("create_user")  # name from your urls.py
        response = self.client.post(url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user_data["email"])

    def test_existing_user(self):
        # First create a user
        User.objects.create(**self.user_data)

        url = reverse("existing_user", kwargs={"email": self.user_data["email"]})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["exists"])
