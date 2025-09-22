
from django.contrib import admin
from .models.address import CustomerAddress
from .models.cart import Cart, CartItem
from .models.category import Category
from .models.product import Product
from .models.user import CustomUser

admin.site.register(CustomerAddress)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(CustomUser)
