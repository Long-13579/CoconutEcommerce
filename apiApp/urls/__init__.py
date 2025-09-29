from django.urls import path, include

urlpatterns = [
    path("products/", include("apiApp.urls.products")),
    path("categories/", include("apiApp.urls.categories")),
    path("carts/", include("apiApp.urls.carts")),
    path("users/", include("apiApp.urls.users")),
    path("order/", include("apiApp.urls.orders")),
    path("delivery/", include("apiApp.urls.delivery")),
    path("roles/", include("apiApp.urls.roles")),
    path("discount/", include("apiApp.urls.discounts")),
]
