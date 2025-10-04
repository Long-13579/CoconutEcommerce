from django.urls import path
from ..views import product_views as views

urlpatterns = [
    path("list", views.product_list, name="product_list"),
    path("list_admin", views.product_list_admin, name="product_list_admin"),
    path("list_by_category", views.product_list_by_category, name="product_list_by_category"),
    path("search", views.product_search, name="product_search"),
    path("create", views.product_create, name="product_create"),
    path("<slug:slug>", views.product_detail, name="product_detail"),
    path("<slug:slug>/update", views.product_update, name="product_update"),
    path("<slug:slug>/delete", views.product_delete, name="product_delete"),
    path('check_and_update_inventory/', views.check_and_update_inventory, name='check_and_update_inventory'),
]
