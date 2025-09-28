from django.db import models
from .product import Product


class ProductRating(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='rating')
    average_rating = models.FloatField(default=0.0)
    total_reviews = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.average_rating} ({self.total_reviews} reviews)"
