from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Product
from ..serializers import ProductListSerializer, ProductDetailSerializer, ProductCreateSerializer
# ...existing code...
from rest_framework import status


@api_view(['GET'])
def product_list(request):
    products = Product.objects.filter(featured=True)
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





