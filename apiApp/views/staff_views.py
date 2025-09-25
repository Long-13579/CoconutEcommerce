from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import CustomerAddress
from ..serializers import UserSerializer, CustomerAddressSerializer

from rest_framework import viewsets
from apiApp.models.user import Staff
from ..serializers import StaffSerializer, CustomerAddressSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

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




@api_view(["POST"])
def create_user(request):
    role_name = request.data.get("role")
    role_obj = None
    if role_name:
        from apiApp.models.role import Role
        try:
            role_obj = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            role_obj = None
    staff = Staff.objects.create(
        username=request.data.get("username"),
        email=request.data.get("email"),
        first_name=request.data.get("first_name"),
        last_name=request.data.get("last_name"),
        profile_picture_url=request.data.get("profile_picture_url"),
        role=role_obj
    )
    serializer = StaffSerializer(staff)
    return Response(serializer.data)



# Remove existing_user for staff management



# Remove add_address for staff management (should be handled in customer views)


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
    # This endpoint should only be for customers, not staff
    # If you want to list staff, use a separate endpoint
    return Response([])