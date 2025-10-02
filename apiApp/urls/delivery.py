from django.urls import path
from ..views import delivery_views as views

urlpatterns = [
    path("get_deliveries/", views.get_deliveries, name="get_deliveries"),
    path("create_delivery/", views.create_delivery, name="create_delivery"),
    path("update_delivery/<int:pk>/", views.update_delivery, name="update_delivery"),
]
