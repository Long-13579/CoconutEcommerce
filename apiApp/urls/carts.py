from django.urls import path
from ..views import cart_views as views

urlpatterns = [
    path("add/", views.add_to_cart, name="add_to_cart"),
    path("update_item/", views.update_cartitem_quantity, name="update_cartitem_quantity"),
    path("delete_item/<int:pk>/", views.delete_cartitem, name="delete_cartitem"),
    path("", views.get_cart, name="get_cart"),
    path("stat/", views.get_cart_stat, name="get_cart_stat"),
    path("product_in_cart/", views.product_in_cart, name="product_in_cart"),
    path("list/", views.cart_list, name="cart_list"),
]
