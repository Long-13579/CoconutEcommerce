from django.urls import path
from ..views import product_views as views

urlpatterns = [
    path("list", views.product_list, name="product_list"),
    path("search", views.product_search, name="product_search"),
    path("create", views.product_create, name="product_create"),
    path("<slug:slug>", views.product_detail, name="product_detail"),
    
]
