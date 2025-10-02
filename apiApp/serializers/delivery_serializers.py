from rest_framework import serializers
from ..models.delivery import Delivery
from ..models.order import Order
from ..models.user import CustomUser

class DeliverySerializer(serializers.ModelSerializer):
    order = serializers.SerializerMethodField()
    assigned_to = serializers.SerializerMethodField()

    def get_order(self, obj):
        if obj.order:
            return {
                "id": obj.order.id,
                "checkout_id": getattr(obj.order, "checkout_id", None),
                "amount": getattr(obj.order, "amount", None),
                "status": getattr(obj.order, "status", None),
            }
        return None

    def get_assigned_to(self, obj):
        if obj.assigned_to:
            return {
                "id": obj.assigned_to.id,
                "email": getattr(obj.assigned_to, "email", None),
            }
        return None

    class Meta:
        model = Delivery
        fields = ["id", "order", "status", "assigned_to", "created_at"]
