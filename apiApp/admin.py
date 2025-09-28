
from django.contrib import admin
from .models.address import CustomerAddress
from .models.cart import Cart, CartItem
from .models.category import Category
from .models.product import Product
from .models.user import CustomUser
from .models.order import Order, OrderItem
from django.contrib.auth.admin import UserAdmin


# CustomUserAdmin without is_staff or list_filter
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email")

    # Remove any reference to is_staff or list_filter
    list_filter = ()

admin.site.register(CustomUser, CustomUserAdmin)


class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "featured"]

admin.site.register(Product, ProductAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]

admin.site.register(Category, CategoryAdmin)



class CartAdmin(admin.ModelAdmin):
    list_display = ("cart_code",)
admin.site.register(Cart, CartAdmin)


class CartItemAdmin(admin.ModelAdmin):
    list_display = ("cart", "product", "quantity")
admin.site.register(CartItem, CartItemAdmin)



admin.site.register([Order, OrderItem, CustomerAddress])