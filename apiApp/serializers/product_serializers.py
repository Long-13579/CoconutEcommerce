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

    # chỉ thêm slug + category
    category = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "slug",                 # 👈 thêm slug
            "photo",
            "name",
            "shortDescription",
            "featureDescription",
            "londDescription",
            "price",
            "qty",
            "rating",
            "reviews",
            "category",             # 👈 thêm category (tên thôi)
        ]

    def get_photo(self, obj):
        try:
            return obj.image.url if obj.image else None
        except:
            return None

    def get_shortDescription(self, obj):
        return obj.description[:50] if obj.description else ""

    def get_featureDescription(self, obj):
        return obj.description[:100] if obj.description else ""

    def get_londDescription(self, obj):
        return obj.description if obj.description else ""

    def get_qty(self, obj):
        return 100  # giữ nguyên như bạn có

    def get_rating(self, obj):
        return 5.0  # giữ nguyên

    def get_reviews(self, obj):
        return []   # giữ nguyên

    def get_category(self, obj):
        return obj.category.name if obj.category else None


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id", "name", "description", "slug", "image", "price",
        ]

class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "name", "description", "slug", "image", "price", "category", "featured"
        ]