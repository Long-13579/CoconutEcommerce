from rest_framework import serializers
from ..models import Discount
from ..models import Product
from .product_serializers import ProductDetailSerializer

class DiscountSerializer(serializers.ModelSerializer):
    products = ProductDetailSerializer(many=True, read_only=True)  # nested products
    product_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Product.objects.all(), write_only=True, source="products"
    )

    class Meta:
        model = Discount
        fields = [
            "id",
            "name",
            "discount_percent",
            "products",       # read-only nested product info
            "product_ids",    # for assigning products by ID
            "start_date",
            "end_date",
        ]