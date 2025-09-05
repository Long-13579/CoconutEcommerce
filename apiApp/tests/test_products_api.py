from rest_framework.test import APITestCase
from django.urls import reverse
from apiApp.models import Product, Category


class TestProductAPI(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics", slug="electronics")

        self.product1 = Product.objects.create(
            name="Smartphone",
            description="A powerful smartphone",
            price=500,
            featured=True,
            category=self.category
        )
        self.product2 = Product.objects.create(
            name="Laptop",
            description="A high-performance laptop",
            price=1200,
            featured=True,
            category=self.category
        )

    def test_product_list(self):
        url = reverse("product_list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        # Only featured products should appear
        self.assertEqual(len(response.data), 2)

    def test_product_detail(self):
        url = reverse("product_detail", args=[self.product1.slug])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Smartphone")

    def test_product_search(self):
        url = reverse("product_search") + "?query=phone"
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertIn("Smartphone", [p["name"] for p in response.data])
