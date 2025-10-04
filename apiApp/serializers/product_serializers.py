from django.utils import timezone
from rest_framework import serializers
from ..models import Product
from .user_serializers import UserSerializer


class ProductListSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()
    shortDescription = serializers.SerializerMethodField()
    featureDescription = serializers.SerializerMethodField()
    longDescription = serializers.SerializerMethodField()
    qty = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    category_id = serializers.IntegerField(source="category.id", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    discount_percent = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", 
            "photo", 
            "name", 
            "slug",
            "description",
            "shortDescription", 
            "featureDescription", 
            "longDescription", 
            "price", 
            "qty", 
            "rating", 
            "reviews",
            "category_id",
            "category_name",
            "discount_percent",
            "featured"
        ]

    def get_photo(self, obj):
        return obj.image.url if obj.image else "https://vetra.laborasyon.com/assets/images/products/1.jpg"

    def get_shortDescription(self, obj):
        return obj.description[:50] if obj.description else ""

    def get_featureDescription(self, obj):
        return obj.description[:100] if obj.description else ""

    def get_longDescription(self, obj):
        return obj.description if obj.description else ""

    def get_qty(self, obj):
        # Return actual quantity from DB
        return getattr(obj, 'quantity', 0)

    def get_rating(self, obj):
        return 5.0

    def get_reviews(self, obj):
        return []
    
    def get_discount_percent(self, obj):
        now = timezone.now()
        discounts = obj.discounts.filter(start_date__lte=now, end_date__gte=now)
        if discounts.exists():
            return max(d.discount_percent for d in discounts)  # best discount
        return 0

class ProductDetailSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(source="category.id", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    discount_percent = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "description", "slug", "image", "price", "category_id", "category_name", "discount_percent", "featured", "quantity"
        ]
    
    def get_discount_percent(self, obj):
        now = timezone.now()
        discounts = obj.discounts.filter(start_date__lte=now, end_date__gte=now)
        if discounts.exists():
            return max(d.discount_percent for d in discounts)  # best discount
        return 0

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "name", "description", "slug", "image", "price", "category", "featured","quantity"
        ]