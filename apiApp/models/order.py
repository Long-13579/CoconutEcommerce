from django.db import models
from .product import Product
from .user import CustomUser

class Order(models.Model):
    checkout_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    customer_email = models.EmailField()
    status = models.CharField(
        max_length=32,
        choices=[
            ("Paid", "Paid"),
            ("Pending from Inventory", "Pending from Inventory"),
            ("Pending from Delivery", "Pending from Delivery"),
            ("Shipping", "Shipping"),
            ("Completed", "Completed"),
            ("Cancelled", "Cancelled"),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="customer", default="2")
    shipping_street = models.CharField(max_length=50, blank=True, null=True, default="Default Street")
    shipping_state = models.CharField(max_length=50, blank=True, null=True, default="Default State")
    shipping_city = models.CharField(max_length=50, blank=True, null=True, default="Default City")
    shipping_phone = models.CharField(max_length=13, blank=True, null=True, default="123456789")

    def __str__(self):
        return f"Order {self.checkout_id} - {self.status}"
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.product.name} - {self.order.checkout_id}"