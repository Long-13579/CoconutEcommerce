from django.core.management.base import BaseCommand
from apiApp.models.order import Order, OrderItem
from apiApp.models.product import Product
from apiApp.models.user import CustomUser
from apiApp.models.address import CustomerAddress
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seed sample orders and order items for testing (no user fields)'

    def handle(self, *args, **kwargs):
        # Make default User
        user = CustomUser.objects.create(
            email = "user@gmail.com",
            username = "Default User",
        )
        user.set_password("123456")  
        user.save()
        #Make default Address
        address = CustomerAddress.objects.create(
            customer = user,
            street = "Default Street",
            state = "Default State",
            city = "Default City",
            phone = "12345689"
        )
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
            order = Order.objects.create(
                checkout_id=f'ORDER_{i+1}_TEST',
                amount=random.randint(100, 1000),
                currency='VND',
                customer_email=user.email,
                status=random.choice(['Paid', 'Pending from Inventory']),
                created_at=timezone.now(),
                user = user,
                shipping_street = address.street,
                shipping_state = address.state,
                shipping_city = address.city,
                shipping_phone = address.phone,
            )
            # Add order items
            for _ in range(random.randint(1, 3)):
                product = random.choice(products)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=random.randint(1, 5),
                    price = 100
                )
        self.stdout.write(self.style.SUCCESS('Sample orders and order items created.'))
