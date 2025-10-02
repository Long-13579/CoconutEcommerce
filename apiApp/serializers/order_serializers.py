from rest_framework import serializers
from .product_serializers import ProductListSerializer
from ..models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ["id", "quantity", "product", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(read_only=True, many=True)
    customer_username = serializers.CharField(source='user.username', read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    def get_user(self, obj):
        try:
            return {"username": obj.user.username} if obj.user_id else None
        except Exception:
            return None
    class Meta:
        model = Order 
        fields = ["id", "checkout_id", "amount", "items", "status", "created_at", "currency", "customer_username", "user"]
