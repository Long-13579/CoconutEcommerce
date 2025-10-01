from django.urls import path
from ..views import discount_views as views

urlpatterns = [
    path("", views.discount_list, name="discount-list"),
    path("create/", views.discount_create, name="discount-create"),
    path("<int:pk>/", views.discount_detail, name="discount-detail"),
    path("<int:pk>/update/", views.discount_update, name="discount-update"),
    path("<int:pk>/partial-update/", views.discount_partial_update, name="discount-partial-update"),
    path("<int:pk>/delete/", views.discount_delete, name="discount-delete"),
    path("<int:pk>/update-products/", views.discount_update_products, name="discount-update-products"),
]
