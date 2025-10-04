import base64
from django.utils import timezone
import hashlib
import hmac
import json
import uuid
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Cart, Order, OrderItem, CustomUser, CustomerAddress
from ..serializers import OrderSerializer, OrderItemSerializer
from ..utils.token_decode import get_user_id_from_request

@api_view(['GET'])
def get_all_orders(request):
  orders = Order.objects.all()
  serializer = OrderSerializer(orders, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def get_orders(request):
  user_id = get_user_id_from_request(request)
  try:
    user = CustomUser.objects.get(id=user_id)
  except CustomUser.DoesNotExist:
    return Response({"error": "User not found"}, status=404)
  email = user.email
  orders = Order.objects.filter(customer_email=email)
  serializer = OrderSerializer(orders, many=True)
  return Response(serializer.data)

@api_view(['POST'])
def create_checkout_session(request):
    user_id = get_user_id_from_request(request)
    #Check address
    address = CustomerAddress.objects.filter(customer_id=user_id).first()
    if address is None:
      return Response({'error': "User's address is missing"}, status=400)
    user = CustomUser.objects.get(id=user_id)
    email = user.email
    cart = Cart.objects.get(user_id=user_id)
    cartItems = cart.cartitems.all()

    total_amount = 0
    for item in cartItems:
      discount_percent = get_discount_percent(item.product)
      temp_total = item.product.price * item.quantity
      total_amount += temp_total * (1 - discount_percent)

    total_amount *= 26000

    json_str = json.dumps({"email": email})
    base64_bytes = base64.b64encode(json_str.encode("utf-8"))
    base64_extra_data = base64_bytes.decode("utf-8")

    # parameters send to MoMo get get payUrl
    endpoint = settings.MOMO_ENDPOINT
    accessKey = settings.MOMO_ACCESS_KEY
    secretKey = settings.MOMO_SECRET_KEY
    orderInfo = settings.MOMO_ORDER_INFO
    partnerCode = settings.MOMO_PARTNER_CODE
    redirectUrl = settings.MOMO_REDIRECT_URL
    ipnUrl = settings.MOMO_IPN_URL
    amount = str(int(total_amount))
    orderId = str(uuid.uuid4())
    requestId = str(uuid.uuid4())
    extraData = base64_extra_data  
    partnerName = settings.MOMO_PARTNER_NAME
    requestType = settings.MOMO_REQUEST_TYPE
    storeId = settings.MOMO_STORE_ID
    orderGroupId = ""
    autoCapture = True
    lang = settings.MOMO_LANGUAGE
    orderGroupId = ""
    rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl+ "&requestId=" + requestId + "&requestType=" + requestType

    # signature
    h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
    signature = h.hexdigest()

    try:
        data = {
            'partnerCode': partnerCode,
            'orderId': orderId,
            'partnerName': partnerName,
            'storeId': storeId,
            'ipnUrl': ipnUrl,
            'amount': amount,
            'lang': lang,
            'requestType': requestType,
            'redirectUrl': redirectUrl,
            'autoCapture': autoCapture,
            'orderInfo': orderInfo,
            'requestId': requestId,
            'extraData': extraData,
            'signature': signature,
            'orderGroupId': orderGroupId
        }
        data = json.dumps(data)
        clen = len(data)
        response = requests.post(endpoint, data=data, headers={'Content-Type': 'application/json', 'Content-Length': str(clen)})
        return Response(response.json(), status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def finish_checkout(request):
  user_id = get_user_id_from_request(request)
  result_code = request.GET.get("resultCode")
  if (int(result_code) != 0):
    return Response(status=204)

  amount = int(request.GET.get("amount"))
  currency = "VND"
  user = CustomUser.objects.get(id=user_id)
  email = user.email
  id = request.GET.get("transId")

  session = {
    'id': id,
    'amount_total': amount,
    'currency': currency,
    'customer_email': email,
  }

  fulfill_checkout(session, user_id)

  return Response(status=200)

def fulfill_checkout(session, user_id):
    address = CustomerAddress.objects.get(customer_id=user_id)
    order = Order.objects.create(checkout_id=session["id"],
        amount=session["amount_total"],
        currency=session["currency"],
        customer_email=session["customer_email"],
        status="Paid",
        user_id=user_id,
        shipping_street=address.street,
        shipping_state=address.state,
        shipping_city=address.city,
        shipping_phone=address.phone
    )

    cart = Cart.objects.get(user_id=user_id)
    cartitems = cart.cartitems.all()

    for item in cartitems:
        discount_percent = get_discount_percent(item.product)
        price = item.product.price * (1 - discount_percent)
        orderitem = OrderItem.objects.create(order=order, product=item.product, 
                                             quantity=item.quantity, price=price)
    
    cart.delete()

def get_discount_percent(product):
  now = timezone.now()
  discounts = product.discounts.filter(start_date__lte=now, end_date__gte=now)
  if discounts.exists():
      return max(d.discount_percent for d in discounts) / 100  # best discount
  return 0
