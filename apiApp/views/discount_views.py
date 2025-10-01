from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Discount
from ..serializers import DiscountSerializer

# List all discounts
@api_view(["GET"])
def discount_list(request):
    discounts = Discount.objects.all()
    serializer = DiscountSerializer(discounts, many=True)
    return Response(serializer.data)


# Create a new discount
@api_view(["POST"])
def discount_create(request):
    serializer = DiscountSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Retrieve a single discount
@api_view(["GET"])
def discount_detail(request, pk):
    try:
        discount = Discount.objects.get(pk=pk)
    except Discount.DoesNotExist:
        return Response({"error": "Discount not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DiscountSerializer(discount)
    return Response(serializer.data)


# Update a discount (full update with PUT)
@api_view(["PUT"])
def discount_update(request, pk):
    try:
        discount = Discount.objects.get(pk=pk)
    except Discount.DoesNotExist:
        return Response({"error": "Discount not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DiscountSerializer(discount, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
def discount_update_products(request, pk):
    try:
        discount = Discount.objects.get(pk=pk)
    except Discount.DoesNotExist:
        return Response({"error": "Discount not found"}, status=status.HTTP_404_NOT_FOUND)
    product_ids = request.data.get("product_ids", [])
    if not isinstance(product_ids, list):
        return Response({"error": "product_ids must be a list"}, status=status.HTTP_400_BAD_REQUEST)
    discount.products.set(product_ids)
    discount.save()
    serializer = DiscountSerializer(discount)
    return Response(serializer.data)

# Partial update (PATCH)
@api_view(["PATCH"])
def discount_partial_update(request, pk):
    try:
        discount = Discount.objects.get(pk=pk)
    except Discount.DoesNotExist:
        return Response({"error": "Discount not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DiscountSerializer(discount, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Delete a discount
@api_view(["DELETE"])
def discount_delete(request, pk):
    try:
        discount = Discount.objects.get(pk=pk)
    except Discount.DoesNotExist:
        return Response({"error": "Discount not found"}, status=status.HTTP_404_NOT_FOUND)

    discount.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
