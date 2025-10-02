from django.urls import path
from ..views import order_views as views
from ..views import order_detail_views

urlpatterns = [
    path("create_checkout_session/", views.create_checkout_session, name="create_checkout_session"),
    path("finish_checkout/", views.finish_checkout, name="finish checkout"),
    path("get_orders/", views.get_orders, name="get_orders"),
    path("get_all_orders/", views.get_all_orders, name="get_all_orders"),
    path("<int:order_id>/", order_detail_views.order_detail, name="order_detail"),
    path("<int:order_id>/update_status/", order_detail_views.update_order_status, name="update_order_status"),
]