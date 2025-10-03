from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
# API login trả về JWT và role
from rest_framework.decorators import api_view
@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    user = authenticate(request, username=email, password=password)
    if user is not None:
        # Only allow admin and staff accounts to login
        if not getattr(user, "is_staff_account", False) and not getattr(user, "is_superuser", False):
            return Response({"detail": "You do not have permission to access the admin dashboard."}, status=403)
        refresh = RefreshToken.for_user(user)
        role_name = user.role.name if user.role else ""
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": role_name,
            "email": user.email,
            "username": user.username,
        })
    return Response({"detail": "Invalid credentials"}, status=400)
from rest_framework.decorators import api_view
from apiApp.utils.permissions import role_required
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import CustomerAddress
from ..serializers import UserSerializer, CustomerAddressSerializer

from rest_framework import viewsets
from apiApp.models.user import CustomUser

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        # For unsafe methods (DELETE, PUT, PATCH), always return all users
        if self.request.method not in ['GET', 'HEAD', 'OPTIONS']:
            return CustomUser.objects.all()
        staff_only = self.request.query_params.get('staff_only')
        if staff_only == 'true':
            return CustomUser.objects.filter(is_staff_account=True)
        # Mặc định chỉ trả về customer (is_staff_account=False)
        return CustomUser.objects.filter(is_staff_account=False)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        role_id = data.get("role")
        role_obj = None
        if role_id:
            from apiApp.models.role import Role
            try:
                role_obj = Role.objects.get(id=role_id)
            except Role.DoesNotExist:
                role_obj = None
        data["role"] = role_obj.id if role_obj else None
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        @role_required(['admin'])
        def destroy(self, request, *args, **kwargs):
            # Chỉ admin mới được xóa user
            return super().destroy(request, *args, **kwargs)
User = get_user_model()


@api_view(["POST"])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save() 
    refresh = RefreshToken.for_user(user)
    return Response({
        "user": serializer.data,
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    })

@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)
    role_name = user.role.name if user.role else ""
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": role_name,
        "email": user.email,
        "username": user.username,
    })


@api_view(["GET"])
def existing_user(request, email):
    exists = User.objects.filter(email=email).exists()
    return Response({"exists": exists}, status=status.HTTP_200_OK if exists else status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def add_address(request):
    email = request.data.get("email")
    customer = User.objects.get(email=email)

    address, _ = CustomerAddress.objects.get_or_create(customer=customer)
    address.street = request.data.get("street")
    address.city = request.data.get("city")
    address.state = request.data.get("state")
    address.phone = request.data.get("phone")
    address.save()

    serializer = CustomerAddressSerializer(address)
    return Response(serializer.data)


@api_view(["GET"])
def get_address(request):
    email = request.query_params.get("email")
    address = CustomerAddress.objects.filter(customer__email=email).last()
    if address:
        serializer = CustomerAddressSerializer(address)
        return Response(serializer.data)
    return Response({"error": "Address not found"}, status=200)

@api_view(["GET"])
def user_list(request):
    # Only return customers (not staff)
    users = User.objects.filter(is_staff_account=False)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["PATCH"])
@role_required(['admin'])
def update_user_status(request, user_id: int):
    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get("status")
    if new_status not in ["Active ✅", "Inactive ⏸️", "Blocked 🚫", "Deleted 🗑️", "Active", "Inactive", "Blocked", "Deleted"]:
        return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    # Persist minimal mapping using is_active
    if new_status.startswith("Active"):
        user.is_active = True
    else:
        user.is_active = False

    user.save(update_fields=["is_active"]) 

    return Response({
        "id": user.id,
        "account_status": "Active" if user.is_active else "Inactive",
        "stored": new_status
    })