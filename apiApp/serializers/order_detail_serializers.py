from rest_framework import serializers
from ..models.order import Order, OrderItem
from ..models.user import CustomUser
from ..models.product import Product

class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price"]

class OrderItemDetailSerializer(serializers.ModelSerializer):
    product = OrderProductSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity"]

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemDetailSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = [
            "id", "checkout_id", "amount", "currency", "customer_email", "status", "created_at", "items"
        ]
