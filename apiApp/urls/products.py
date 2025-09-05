from django.urls import path
from ..views import product_views as views

urlpatterns = [
    path("list", views.product_list, name="product_list"),
    path("<slug:slug>", views.product_detail, name="product_detail"),
    path("search", views.product_search, name="product_search"),
]
