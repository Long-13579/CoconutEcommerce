from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import CustomerAddress
from ..serializers import UserSerializer, CustomerAddressSerializer

User = get_user_model()


@api_view(["POST"])
def create_user(request):
    user = User.objects.create(
        username=request.data.get("username"),
        email=request.data.get("email"),
        first_name=request.data.get("first_name"),
        last_name=request.data.get("last_name"),
        profile_picture_url=request.data.get("profile_picture_url")
    )
    serializer = UserSerializer(user)
    return Response(serializer.data)


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
