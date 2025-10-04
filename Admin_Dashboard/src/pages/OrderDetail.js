import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getOrderDetail, updateOrderStatus } from "../services/orderService";
import PageTitle from "../components/Typography/PageTitle";

const OrderDetail = () => {
  const { order_id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  
  // Lấy tham số 'from' từ URL để biết đang từ trang nào
  const fromPage = new URLSearchParams(location.search).get('from');

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError("");
      try {
        const data = await getOrderDetail(order_id);
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        setError("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [order_id]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await updateOrderStatus(order_id, status);
      alert("Cập nhật trạng thái thành công!");
    } catch {
      alert("Cập nhật trạng thái thất bại!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  // Xác định link back dựa trên trang nguồn
  const getBackLink = () => {
    switch (fromPage) {
      case 'delivery':
        return { to: '/delivery', text: '← Back to Delivery Management' };
      case 'customers':
        return { to: '/customers', text: '← Back to Customers' };
      default:
        return { to: '/orders', text: '← Back to Orders' };
    }
  };

  const backLink = getBackLink();

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link to={backLink.to} className="text-blue-600 hover:underline">{backLink.text}</Link>
      </div>
      <PageTitle>Order Detail #{order.id}</PageTitle>
      <div className="bg-white shadow rounded p-6">
  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="text-gray-500 text-sm">Order ID</label>
            <div className="font-semibold text-base border rounded px-3 py-2 bg-gray-50 mb-2 md:mb-0 md:mr-2">{order.id}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Checkout ID</label>
            <div className="font-semibold text-base border rounded px-3 py-2 bg-gray-50 mb-2 md:mb-0">{order.checkout_id}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Status</label>
            <div className="font-semibold text-base border rounded px-3 py-2 bg-gray-50 mb-2 md:mb-0 md:mr-2">{order.status}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Created At</label>
            <div className="font-semibold text-base border rounded px-3 py-2 bg-gray-50 mb-2 md:mb-0">{order.created_at}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Amount</label>
            <div className="font-semibold text-base border rounded px-3 py-2 bg-gray-50 mb-2 md:mb-0 md:mr-2">{order.amount} {order.currency}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Customer Email</label>
            <div className="font-semibold text-base border rounded px-3 py-2 bg-gray-50 mb-2 md:mb-0">{order.customer_email}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm">User Name</label>
            <div className="font-semibold text-base border rounded px-3 py-2 bg-gray-50 mb-2 md:mb-0 md:mr-2">{order.user_name} (ID: {order.user_id})</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Shipping Address</label>
            <div className="font-semibold text-base border rounded px-3 py-2 bg-gray-50 mb-2 md:mb-0">{order.shipping_street}, {order.shipping_city}, {order.shipping_state}</div>
          </div>
          <div>
            <label className="text-gray-500 text-sm">Shipping Phone</label>
            <div className="font-semibold text-base border rounded px-3 py-2 bg-gray-50 mb-2 md:mb-0 md:mr-2">{order.shipping_phone}</div>
          </div>
        </div>
        <div className="mb-4">
          <strong>Update Status:</strong>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border rounded px-2 py-1 ml-2"
            disabled={updating}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
            disabled={updating}
          >
            {updating ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
        <div>
          <strong>Order Items:</strong>
          <table className="w-full mt-2 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td className="p-2 border">{item.id}</td>
                  <td className="p-2 border">{item.product.name}</td>
                  <td className="p-2 border">{item.product.price}</td>
                  <td className="p-2 border">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
