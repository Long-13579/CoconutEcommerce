from django.db import models
from .order import Order
from .user import CustomUser

class Delivery(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="deliveries")
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_deliveries")
    status = models.CharField(max_length=32, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Delivery #{self.id} for Order #{self.order.id}"
