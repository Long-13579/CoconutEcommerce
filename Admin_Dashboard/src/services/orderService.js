const BASE_URL = "http://127.0.0.1:8000/api/order/";

export async function getAllOrders() {
  const res = await fetch(BASE_URL + "get_all_orders/");
  if (!res.ok) throw new Error("Không thể lấy danh sách đơn hàng");
  return await res.json();
}

export async function getOrderDetail(order_id) {
  const res = await fetch(BASE_URL + `${order_id}/`);
  if (!res.ok) throw new Error("Không thể lấy chi tiết đơn hàng");
  return await res.json();
}

export async function updateOrderStatus(order_id, status) {
  const res = await fetch(BASE_URL + `${order_id}/update_status/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Không thể cập nhật trạng thái đơn hàng");
  return await res.json();
}
