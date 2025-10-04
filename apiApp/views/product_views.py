from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Product
from ..serializers import ProductListSerializer, ProductDetailSerializer, ProductCreateSerializer
# ...existing code...
from rest_framework import status


@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def product_list_admin(request):
    products = Product.objects.all()
    serializer = ProductDetailSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def product_list_by_category(request):
    category_name = request.query_params.get("category_name")
    products = Product.objects.filter(featured=True, category__name__icontains=category_name)
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def product_detail(request, slug):
    product = Product.objects.get(slug=slug)
    serializer = ProductDetailSerializer(product)
    return Response(serializer.data)


@api_view(['GET'])
def product_search(request):
    query = request.query_params.get("query")
    if not query:
        return Response("No query provided", status=400)

    products = Product.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query) |
        Q(category__name__icontains=query)
    )
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def product_create(request):
    serializer = ProductCreateSerializer(data=request.data)
    if serializer.is_valid():
        product = serializer.save()
        detail_serializer = ProductDetailSerializer(product)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
def product_update(request, slug):
    try:
        product = Product.objects.get(slug=slug)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductCreateSerializer(product, data=request.data, partial=True)  # PATCH cho phép update 1 phần
    if serializer.is_valid():
        product = serializer.save()
        detail_serializer = ProductDetailSerializer(product)
        return Response(detail_serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def product_delete(request, slug):
    try:
        product = Product.objects.get(slug=slug)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    product.delete()
    return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def check_and_update_inventory(request):
    """
    Kiểm tra tồn kho khi kho bấm 'Packed'.
    Dữ liệu gửi lên dạng:
    {
        "items": [
            {"product_id": 10, "quantity": 4},
            {"product_id": 3, "quantity": 5}
        ]
    }
    """
    items = request.data.get("items", [])
    if not items:
        return Response({"error": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)

    insufficient = []
    updated_products = []

    for item in items:
        pid = item.get("product_id")
        qty_needed = int(item.get("quantity", 0))
        try:
            product = Product.objects.get(id=pid)
            if product.quantity >= qty_needed:
                product.quantity -= qty_needed
                product.save()
                updated_products.append({
                    "id": pid,
                    "name": product.name,
                    "remaining": product.quantity
                })
            else:
                insufficient.append({
                    "id": pid,
                    "name": product.name,
                    "available": product.quantity,
                    "needed": qty_needed
                })
        except Product.DoesNotExist:
            insufficient.append({"id": pid, "error": "Product not found"})

    if insufficient:
        return Response({
            "status": "failed",
            "message": "Some products are out of stock",
            "insufficient": insufficient
        }, status=status.HTTP_200_OK)

    return Response({
        "status": "success",
        "message": "Inventory updated successfully",
        "updated_products": updated_products
    }, status=status.HTTP_200_OK)






