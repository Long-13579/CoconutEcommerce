from django.core.management.base import BaseCommand
from apiApp.models import Category, Product  # adjust "shop" if your app has another name


class Command(BaseCommand):
    help = "Initialize default categories and products"

    def handle(self, *args, **options):
        # ---------- PERMISSIONS & ROLES ----------
        initial_perms = [
            "orders.view", "orders.edit", "orders.assign", "orders.update_status",
            "products.create", "products.update", "products.delete", "products.view", "products.manage",
            "customers.view", "inventory.manage",
            "tickets.create", "tickets.update", "tickets.close",
            "delivery.view", "delivery.manage",
            "returns.process",
            "payments.view", "payments.verify", "payments.refund",
            "users.manage", "rbac.manage",
            "dashboard.view", "chat.access",
        ]
        from apiApp.models.role import Role, Permission
        for perm_name in initial_perms:
            Permission.objects.get_or_create(name=perm_name)

        role_permissions = {
            "admin": "all",
            "staff_inventory": [
                "products.create",
                "products.update",
                "products.delete",
                "products.view",
                "inventory.manage",
                "dashboard.view"
            ],
            "staff_support": [
                "orders.view",
                "customers.view",
                "tickets.create",
                "tickets.update",
                "tickets.close",
                "chat.access",
                "dashboard.view"
            ],
            "staff_delivery": [
                "orders.view",
                "orders.assign",
                "orders.update_status",
                "delivery.view",
                "delivery.manage",
                "returns.process",
                "dashboard.view"
            ],
            "staff_sale": [
                "orders.view",
                "customers.view",
                "chat.access",
                "delivery.view",
                "dashboard.view"
            ],
        }
        for role_name, perms in role_permissions.items():
            role_obj, _ = Role.objects.get_or_create(name=role_name)
            if perms == "all":
                perm_objs = Permission.objects.all()
            else:
                perm_objs = Permission.objects.filter(name__in=perms)
            role_obj.permissions.set(perm_objs)
            role_obj.save()
        self.stdout.write(self.style.SUCCESS("Seeded permissions and roles successfully."))

        # ---------- CATEGORIES ----------
        categories_data = [
            {"name": "Oils & Extracts", "icon": "/Oil_Extracts.svg"},
            {"name": "Kitchenware", "icon": "/Kitchenware.svg"},
            {"name": "Snacks", "icon": "/Snacks.svg"},
            {"name": "Personal Care", "icon": "/Personal_Care.svg"},
        ]

        category_map = {}
        for cat in categories_data:
            obj, created = Category.objects.get_or_create(
                name=cat["name"],
                defaults={"image": f'category_img{cat["icon"]}'},
            )
            category_map[cat["name"]] = obj
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created category: {obj.name}"))
            else:
                # update image if changed
                obj.image = f'category_img{cat["icon"]}'
                obj.save()
                self.stdout.write(self.style.WARNING(f"Updated category: {obj.name}"))

        # ---------- PRODUCTS ----------
        products_data = [
            # Oils & Extracts
            {"name": "Cold-Pressed Coconut Oil", "price": "8.00", "image": "/cold_pressed_coconut_oil.jpg", "category": "Oils & Extracts",
             "description": "Pure cold-pressed coconut oil, retaining maximum nutrients and natural flavor. Ideal for cooking, baking, and skincare."},
            {"name": "Virgin Coconut Oil", "price": "9.00", "image": "/virgin_coconut_oil.jpg", "category": "Oils & Extracts",
             "description": "Fresh virgin coconut oil with a delicate aroma, perfect for smoothies, salads, and daily beauty routines."},
            {"name": "Refined Coconut Oil", "price": "7.50", "image": "/refined_coconut_oil.png", "category": "Oils & Extracts",
             "description": "Clean and mild refined coconut oil, versatile for high-heat cooking, frying, and baking."},
            {"name": "Coconut Butter", "price": "6.00", "image": "/coconut_butter.jpg", "category": "Oils & Extracts",
             "description": "Smooth coconut butter, rich in flavor and healthy fats. Spread on toast or use in desserts."},
            {"name": "Coconut Extract", "price": "5.50", "image": "/coconut_extract.jpg", "category": "Oils & Extracts",
             "description": "Concentrated coconut extract for baking and flavoring. Adds a natural tropical taste to your recipes."},

            # Kitchenware
            {"name": "Coconut Bowl", "price": "5.00", "image": "/coconut_bowl.jpg", "category": "Kitchenware",
             "description": "Eco-friendly handmade coconut bowl, perfect for smoothie bowls, salads, and snacks."},
            {"name": "Coconut Cups", "price": "4.50", "image": "/coconut_cups.jpg", "category": "Kitchenware",
             "description": "Sustainable coconut shell cups, ideal for juices, cocktails, or rustic table settings."},
            {"name": "Coconut Cutlery", "price": "3.00", "image": "/coconut_cutlery.jpg", "category": "Kitchenware",
             "description": "Reusable coconut wood cutlery set, lightweight and biodegradable for eco-conscious dining."},
            {"name": "Coconut Serving Trays", "price": "6.50", "image": "/coconut_serving_trays.jpg", "category": "Kitchenware",
             "description": "Handcrafted coconut serving trays, stylish and durable for snacks, drinks, or décor."},
            {"name": "Coconut Candle Holders", "price": "4.00", "image": "/coconut_candle_holders.jpg", "category": "Kitchenware",
             "description": "Rustic coconut shell candle holders, adding a warm, natural touch to any space."},

            # Snacks
            {"name": "Coconut Chips", "price": "3.50", "image": "/coconut_chips.jpg", "category": "Snacks",
             "description": "Crispy roasted coconut chips, lightly sweetened for a healthy and delicious snack."},
            {"name": "Toasted Coconut Chips", "price": "3.80", "image": "/toasted_coconut_chips.jpg", "category": "Snacks",
             "description": "Golden toasted coconut chips with a crunchy texture and rich flavor. Great for snacking or toppings."},
            {"name": "Coconut Candy", "price": "2.50", "image": "/coconut_candy.jpg", "category": "Snacks",
             "description": "Sweet and chewy coconut candy made with natural ingredients. A tropical treat for all ages."},
            {"name": "Coconut Cookies", "price": "4.20", "image": "/coconut_cookies.jpg", "category": "Snacks",
             "description": "Crispy coconut cookies baked with real coconut flakes for a delightful crunch."},
            {"name": "Coconut Granola", "price": "5.00", "image": "/coconut_granola.jpg", "category": "Snacks",
             "description": "Nutritious granola with crunchy oats and coconut, perfect for breakfast or as a snack."},

            # Personal Care
            {"name": "Coconut Soap", "price": "4.00", "image": "/coconut_soap.jpg", "category": "Personal Care",
             "description": "Moisturizing coconut soap with natural oils, gentle on the skin and refreshing."},
            {"name": "Coconut Shampoo", "price": "6.00", "image": "/coconut_shampoo.jpg", "category": "Personal Care",
             "description": "Nourishing coconut shampoo that strengthens hair, leaving it soft and shiny."},
            {"name": "Coconut Body Lotion", "price": "7.00", "image": "/coconut_body_lotion.jpg", "category": "Personal Care",
             "description": "Hydrating coconut body lotion that smooths and softens skin with a tropical scent."},
            {"name": "Coconut Lip Balm", "price": "2.00", "image": "/coconut_lip_balm.jpg", "category": "Personal Care",
             "description": "Natural coconut lip balm that nourishes and protects lips from dryness."},
            {"name": "Coconut Face Scrub", "price": "5.50", "image": "/coconut_face_scrub.jpg", "category": "Personal Care",
             "description": "Exfoliating coconut face scrub that gently removes dead skin cells for a fresh glow."},
        ]

        for prod in products_data:
            obj, created = Product.objects.get_or_create(
                name=prod["name"],
                defaults={
                    "description": prod["description"],
                    "price": prod["price"],
                    "image": f'product_img{prod["image"]}',
                    "category": category_map.get(prod["category"]),
                    "featured": True,
                    "quantity": 100
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created product: {obj.name}"))
            else:
                # update fields if already exist
                obj.description = prod["description"]
                obj.price = prod["price"]
                obj.image = f'product_img{prod["image"]}'
                obj.category = category_map.get(prod["category"])
                obj.quantity = 100
                obj.save()
                self.stdout.write(self.style.WARNING(f"Updated product: {obj.name}"))
