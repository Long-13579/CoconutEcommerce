from django.urls import path
from ..views import category_views as views

urlpatterns = [
    path("list", views.category_list, name="category_list"),
    path("<slug:slug>", views.category_detail, name="category_detail"),
]
