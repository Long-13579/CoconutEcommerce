from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models.order import Order
from ..models.user import CustomUser
from .order_views import OrderItem
from ..serializers.order_detail_serializers import OrderDetailSerializer

@api_view(["POST"])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get("status")
    if new_status not in dict(Order._meta.get_field("status").choices):
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    order.status = new_status
    order.save()

    # If status is changed to 'Pending from Delivery', create Delivery record if not exists
    if new_status == "Pending from Delivery":
        from ..models.delivery import Delivery
        if not Delivery.objects.filter(order=order).exists():
            Delivery.objects.create(order=order, status="Pending from Delivery")

    return Response({"success": True, "order_id": order.id, "new_status": order.status})

@api_view(["GET"])
def order_detail(request, order_id):
    try:
        print(order_id)
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = OrderDetailSerializer(order)
    # Optionally, add customer info, timeline, notes, etc. here
    return Response(serializer.data)