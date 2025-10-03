from rest_framework import routers
from apiApp.views.user_views import UserViewSet
from django.urls import path
from apiApp.views import user_views as views
from apiApp.views.user_views import login_view

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = router.urls + [
    path("create/", views.create_user, name="create_user"),
    path("exists/<str:email>", views.existing_user, name="existing_user"),
    path("add_address/", views.add_address, name="add_address"),
    path("get_address/", views.get_address, name="get_address"),
    path("list/", views.user_list, name="user_list"),
    path('login/', login_view, name='login'),
    path('login_user/', views.login, name='login_user'),
    path('update_status/<int:user_id>/', views.update_user_status, name='update_user_status'),
]
