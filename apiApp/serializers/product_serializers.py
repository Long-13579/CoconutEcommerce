from rest_framework import serializers
from ..models import Product
from .user_serializers import UserSerializer


class ProductListSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()
    shortDescription = serializers.SerializerMethodField()
    featureDescription = serializers.SerializerMethodField()
    londDescription = serializers.SerializerMethodField()
    qty = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "photo", "name", "shortDescription", "featureDescription", "londDescription", "price", "qty", "rating", "reviews"]

    def get_photo(self, obj):
        return obj.image.url if obj.image else "https://vetra.laborasyon.com/assets/images/products/1.jpg"

    def get_shortDescription(self, obj):
        return obj.description[:50] if obj.description else ""

    def get_featureDescription(self, obj):
        return obj.description[:100] if obj.description else ""

    def get_londDescription(self, obj):
        return obj.description if obj.description else ""

    def get_qty(self, obj):
        return 100

    def get_rating(self, obj):
        return 5.0

    def get_reviews(self, obj):
        return []

class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id", "name", "description", "slug", "image", "price","category","featured"
        ]

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "name", "description", "slug", "image", "price", "category", "featured"
        ]