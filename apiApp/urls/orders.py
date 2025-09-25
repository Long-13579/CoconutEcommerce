from django.urls import path
from ..views import order_views as views

urlpatterns = [
    path("create_checkout_session/", views.create_checkout_session, name="create_checkout_session"),
    path("finish_checkout", views.finish_checkout, name="finish checkout"),
    path("get_orders", views.get_orders, name="get_orders"),
]