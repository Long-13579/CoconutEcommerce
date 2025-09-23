from rest_framework import serializers
from ..models import Category
from .product_serializers import ProductListSerializer


class CategoryListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "image", "slug"]

    def get_image(self, obj):
        return obj.image.url if obj.image else "https://vetra.laborasyon.com/assets/images/products/1.jpg"


class CategoryDetailSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "image", "products"]
