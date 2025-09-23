from django.contrib import admin
from .models import Cart, CartItem, Category, CustomUser, Order, OrderItem, Product, CustomerAddress
from django.contrib.auth.admin import UserAdmin

# Register your models here.

class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "first_name", "last_name")
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