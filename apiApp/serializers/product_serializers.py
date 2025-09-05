from rest_framework import serializers
from ..models import Product
from .user_serializers import UserSerializer


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "slug", "image", "price"]

class ProductDetailSerializer(serializers.ModelSerializer):
    poor_review = serializers.SerializerMethodField()
    fair_review = serializers.SerializerMethodField()
    good_review = serializers.SerializerMethodField()
    very_good_review = serializers.SerializerMethodField()
    excellent_review = serializers.SerializerMethodField()
    similar_products = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "description", "slug", "image", "price",
            "reviews", "rating", "similar_products",
            "poor_review", "fair_review", "good_review",
            "very_good_review", "excellent_review"
        ]

    def get_similar_products(self, product):
        products = Product.objects.filter(category=product.category).exclude(id=product.id)
        from .product_serializers import ProductListSerializer
        return ProductListSerializer(products, many=True).data

    def get_poor_review(self, product):
        return product.reviews.filter(rating=1).count()

    def get_fair_review(self, product):
        return product.reviews.filter(rating=2).count()

    def get_good_review(self, product):
        return product.reviews.filter(rating=3).count()

    def get_very_good_review(self, product):
        return product.reviews.filter(rating=4).count()

    def get_excellent_review(self, product):
        return product.reviews.filter(rating=5).count()
