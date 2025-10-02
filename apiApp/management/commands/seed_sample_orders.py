from django.core.management.base import BaseCommand
from apiApp.models.order import Order, OrderItem
from apiApp.models.product import Product
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seed sample orders and order items for testing (no user fields)'

    def handle(self, *args, **kwargs):
        # Use static emails for clients
        emails = [f'user{i+1}@example.com' for i in range(3)]
        # Create some sample products if not exist
        products = list(Product.objects.all())
        if not products:
            for i in range(5):
                p = Product.objects.create(
                    name=f"Sample Product {i+1}",
                    description="Sample description",
                    price=random.randint(10, 100)
                )
                products.append(p)
        # Create sample orders
        for i in range(5):
            email = random.choice(emails)
            order = Order.objects.create(
                checkout_id=f'ORDER_{i+1}_TEST',
                amount=random.randint(100, 1000),
                currency='VND',
                customer_email=email,
                status=random.choice(['Paid', 'Pending from Inventory']),
                created_at=timezone.now()
            )
            # Add order items
            for _ in range(random.randint(1, 3)):
                product = random.choice(products)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=random.randint(1, 5)
                )
        self.stdout.write(self.style.SUCCESS('Sample orders and order items created.'))
