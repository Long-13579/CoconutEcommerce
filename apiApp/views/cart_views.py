from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Cart, CartItem, Product
from ..serializers import CartSerializer, CartItemSerializer, CartStatSerializer, SimpleCartSerializer
from ..utils.token_decode import get_user_id_from_request


@api_view(["POST"])
def add_to_cart(request):
    user_id = get_user_id_from_request(request=request)
    product_id = request.data.get("product_id")

    cart, _ = Cart.objects.get_or_create(user_id=user_id)
    product = Product.objects.get(id=product_id)

    cartitem, _ = CartItem.objects.get_or_create(product=product, cart=cart)
    cartitem.quantity = 1
    cartitem.save()

    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['PUT'])
def update_cartitem_quantity(request):
    cartitem_id = request.data.get("item_id")
    quantity = int(request.data.get("quantity"))

    cartitem = CartItem.objects.get(id=cartitem_id)
    cartitem.quantity = quantity
    cartitem.save()

    serializer = CartItemSerializer(cartitem)
    return Response({"data": serializer.data, "message": "Cartitem updated successfully!"})


@api_view(['DELETE'])
def delete_cartitem(request, pk):
    cartitem = CartItem.objects.get(id=pk)
    cartitem.delete()
    return Response("Cartitem deleted successfully!", status=204)


@api_view(['GET'])
def get_cart(request):
    user_id = get_user_id_from_request(request=request)
    cart = Cart.objects.filter(user_id=user_id).first()
    if cart:
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response([])


@api_view(['GET'])
def get_cart_stat(request):
    user_id = request.query_params.get("user_id")
    cart = Cart.objects.filter(user_id=user_id).first()
    if cart:
        serializer = CartStatSerializer(cart)
        return Response(serializer.data)
    return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def product_in_cart(request):
    user_id = request.query_params.get("user_id")
    product_id = request.query_params.get("product_id")

    cart = Cart.objects.filter(user_id=user_id).first()
    product = Product.objects.get(id=product_id)
    exists = CartItem.objects.filter(cart=cart, product=product).exists()

    return Response({'product_in_cart': exists})


@api_view(["GET"])
def cart_list(request):
    carts = Cart.objects.all()
    serializer = CartStatSerializer(carts, many=True)
    return Response(serializer.data)
