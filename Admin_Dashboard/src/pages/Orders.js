
import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody, Label, Select, Input, Button } from "@windmill/react-ui";
import { NavLink } from "react-router-dom";

// Hàm cập nhật trạng thái đơn hàng
async function updateStatus(orderId, newStatus) {
  const response = await fetch(`http://localhost:8000/api/order/${orderId}/update_status/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  if (response.ok) {
    window.location.reload();
  } else {
    alert("Cập nhật trạng thái thất bại!");
  }
}

const STATUS_COLORS = {
  Paid: "bg-green-500 text-white",
  "Pending from Inventory": "bg-yellow-400 text-black",
  "Pending from Delivery": "bg-blue-400 text-white",
  Shipping: "bg-blue-500 text-white",
  Completed: "bg-green-700 text-white",
  Cancelled: "bg-red-500 text-white",
};

const statusOptions = [
  "All",
  "Paid",
  "Pending from Inventory",
  "Pending from Delivery",
  "Shipping",
  "Completed",
  "Cancelled",
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/api/order/get_orders/");
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          const text = await response.text();
          setError("API error: " + text.substring(0, 200));
          return;
        }
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          setOrders(data);
        } else {
          const text = await response.text();
          setError("API returned HTML: " + text.substring(0, 200));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    let match = true;
    if (filterStatus !== "All" && order.status !== filterStatus) match = false;
    if (search) {
      const s = search.toLowerCase();
      if (
        !order.id.toString().includes(s) &&
        !(order.customer_email && order.customer_email.toLowerCase().includes(s)) &&
        !(order.customer_phone && order.customer_phone.toLowerCase().includes(s))
      )
        match = false;
    }
    if (dateFrom && new Date(order.created_at) < new Date(dateFrom)) match = false;
    if (dateTo && new Date(order.created_at) > new Date(dateTo)) match = false;
    return match;
  });

  return (
    <div className="w-full flex flex-col flex-grow">
      <PageTitle>Order Management</PageTitle>
      {/* Filter Bar */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-wrap gap-4 items-center">
            <Label>
              <span>Status</span>
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                {statusOptions.map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </Select>
            </Label>
            <Label>
              <span>Date From</span>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </Label>
            <Label>
              <span>Date To</span>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </Label>
            <Label className="flex-1">
              <span>Search (Order ID / Email / Phone)</span>
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
            </Label>
          </div>
        </CardBody>
      </Card>
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-red-600 text-center py-4">{error}</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4">No orders found.</td></tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="border px-4 py-2">
                    <div>{order.customer_name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{order.customer_email}</div>
                    <div className="text-xs text-gray-500">{order.customer_phone}</div>
                  </td>
                  <td className="border px-4 py-2">{order.id}</td>
                  <td className="border px-4 py-2">{order.amount} {order.currency}</td>
                  <td className={`border px-4 py-2 font-bold rounded ${STATUS_COLORS[order.status] || "bg-gray-300"}`}>{order.status}</td>
                  <td className="border px-4 py-2">{order.created_at}</td>
                  <td className="border px-4 py-2">
                    <NavLink to={`/orders/${order.id}`} className="text-blue-600 underline mr-2">Xem chi tiết</NavLink>
                    {/* Action buttons for each status and role */}
                    {/* Sale Staff/Admin: Paid */}
                    {order.status === "Paid" && (
                      <>
                        <Button size="small" className="mr-2 bg-yellow-400 text-black" onClick={() => updateStatus(order.id, "Pending from Inventory")}>Send to Inventory</Button>
                        <Button size="small" className="mr-2 bg-red-500 text-white" onClick={() => updateStatus(order.id, "Cancelled")}>Cancel Order</Button>
                      </>
                    )}
                    {/* Inventory Staff/Admin: Pending from Inventory */}
                    {order.status === "Pending from Inventory" && (
                      <Button size="small" className="mr-2 bg-blue-400 text-white" onClick={() => updateStatus(order.id, "Pending from Delivery")}>Send to Delivery</Button>
                    )}
                    {/* Delivery Staff/Admin: Pending from Delivery */}
                    {order.status === "Pending from Delivery" && (
                      <Button size="small" className="mr-2 bg-blue-500 text-white" onClick={() => updateStatus(order.id, "Shipping")}>Start Shipping</Button>
                    )}
                    {/* Delivery Staff/Admin: Shipping - button disabled in Orders page */}
                    {order.status === "Shipping" && (
                      <Button size="small" className="mr-2 bg-green-700 text-white" disabled>Complete Delivery</Button>
                    )}
                    {/* Admin: Completed */}
                    {order.status === "Completed" && (
                      <Button size="small" className="mr-2 bg-red-500 text-white" disabled>Order Completed</Button>
                    )}
                    {/* Admin: Cancelled */}
                    {order.status === "Cancelled" && (
                      <Button size="small" className="mr-2 bg-gray-400 text-white" disabled>Order Cancelled</Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
