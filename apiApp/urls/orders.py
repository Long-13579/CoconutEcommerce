from django.urls import path
from ..views import order_views as views

urlpatterns = [
    path("create_checkout_session/", views.create_checkout_session, name="create_checkout_session"),
    path("webhook/", views.my_webhook_view, name="webhook"),
    path("get_orders", views.get_orders, name="get_orders"),
]