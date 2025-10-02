from django.utils import timezone
from rest_framework import serializers
from ..models import Cart, CartItem
from .product_serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    sub_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "sub_total"]

    def get_sub_total(self, cartitem):
        discount_percent = get_discount_percent(cartitem.product)
        price = cartitem.product.price * (1 - discount_percent)
        return price * cartitem.quantity


class CartSerializer(serializers.ModelSerializer):
    cartitems = CartItemSerializer(read_only=True, many=True)
    cart_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "cart_code", "cartitems", "cart_total"]

    def get_cart_total(self, cart):
        total = 0
        for item in cart.cartitems.all():
            discount_percent = get_discount_percent(item.product)
            price = item.product.price * (1 - discount_percent)
            total += price * item.quantity
        return total

class CartStatSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "cart_code", "avatar", "name", "amount", "status", "date"]

    def get_avatar(self, cart):
        # Trả về avatar mặc định hoặc từ user
        return "https://i.pravatar.cc/300"

    def get_name(self, cart):
        # Trả về tên khách hàng hoặc mã cart
        first_item = cart.cartitems.first()
        if first_item and hasattr(first_item.product, 'name'):
            return first_item.product.name
        return cart.cart_code

    def get_amount(self, cart):
        # Tổng tiền của cart
        return sum([item.quantity * item.product.price for item in cart.cartitems.all()])

    def get_status(self, cart):
        # Trả về trạng thái mẫu (có thể sửa logic theo thực tế)
        return "Completed"

    def get_date(self, cart):
        # Trả về ngày tạo cart
        return cart.created_at.strftime("%a %b %d %Y %H:%M:%S GMT%z (%Z)")


class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "cart_code", "num_of_items"]

    def get_num_of_items(self, cart):
        return sum([item.quantity for item in cart.cartitems.all()])

def get_discount_percent(product):
  now = timezone.now()
  discounts = product.discounts.filter(start_date__lte=now, end_date__gte=now)
  if discounts.exists():
      return max(d.discount_percent for d in discounts) / 100  # best discount
  return 0