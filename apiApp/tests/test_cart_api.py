from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apiApp.models import Cart, CartItem, Product, Category


class TestCartAPI(APITestCase):
    def setUp(self):
        # Create a category and product
        self.category = Category.objects.create(name="Electronics")
        self.product = Product.objects.create(
            name="Laptop",
            description="A fast laptop",
            price=1500,
            featured=True,
            category=self.category
        )
        self.cart_code = "test123"

    def test_add_to_cart(self):
        url = reverse("add_to_cart")
        response = self.client.post(url, {
            "cart_code": self.cart_code,
            "product_id": self.product.id
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("id", response.data)  # cart id should be present
        self.assertEqual(Cart.objects.count(), 1)
        self.assertEqual(CartItem.objects.count(), 1)

    def test_update_cartitem_quantity(self):
        # first add to cart
        cart = Cart.objects.create(cart_code=self.cart_code)
        cartitem = CartItem.objects.create(cart=cart, product=self.product, quantity=1)

        url = reverse("update_cartitem_quantity")
        response = self.client.put(url, {
            "item_id": cartitem.id,
            "quantity": 5
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cartitem.refresh_from_db()
        self.assertEqual(cartitem.quantity, 5)

    def test_delete_cartitem(self):
        cart = Cart.objects.create(cart_code=self.cart_code)
        cartitem = CartItem.objects.create(cart=cart, product=self.product, quantity=1)

        url = reverse("delete_cartitem", args=[cartitem.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CartItem.objects.count(), 0)

    def test_get_cart(self):
        cart = Cart.objects.create(cart_code=self.cart_code)
        CartItem.objects.create(cart=cart, product=self.product, quantity=2)

        url = reverse("get_cart", args=[self.cart_code])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["cart_code"], self.cart_code)

    def test_get_cart_stat(self):
        cart = Cart.objects.create(cart_code=self.cart_code)
        CartItem.objects.create(cart=cart, product=self.product, quantity=3)

        url = reverse("get_cart_stat")
        response = self.client.get(url, {"cart_code": self.cart_code})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_items", response.data)  # adjust if your serializer field differs

    def test_product_in_cart(self):
        cart = Cart.objects.create(cart_code=self.cart_code)
        CartItem.objects.create(cart=cart, product=self.product, quantity=1)

        url = reverse("product_in_cart")
        response = self.client.get(url, {
            "cart_code": self.cart_code,
            "product_id": self.product.id
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["product_in_cart"])
