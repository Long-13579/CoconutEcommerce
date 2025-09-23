from django.urls import path
from ..views import user_views as views

urlpatterns = [
    path("create/", views.create_user, name="create_user"),
    path("exists/<str:email>", views.existing_user, name="existing_user"),
    path("add_address/", views.add_address, name="add_address"),
    path("get_address/", views.get_address, name="get_address"),
    path("list/", views.user_list, name="user_list"),
]
