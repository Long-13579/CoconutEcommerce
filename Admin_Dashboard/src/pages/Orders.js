
import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody, Label, Select, Input, Button } from "@windmill/react-ui";
import { NavLink } from "react-router-dom";
import { ReactComponent as EyeIcon } from "../icons/eye.svg";

// Helpers lưu/đọc mốc thời gian vòng đời đơn hàng
function getLifecycleStore() {
  try {
    return JSON.parse(localStorage.getItem("orderLifecycleDates") || "{}");
  } catch (e) {
    return {};
  }
}

function saveLifecycleStore(store) {
  try {
    localStorage.setItem("orderLifecycleDates", JSON.stringify(store));
  } catch (e) {
    // ignore
  }
}

function setLifecycleDate(orderId, field, dateStr) {
  const store = getLifecycleStore();
  const id = String(orderId);
  store[id] = store[id] || {};
  store[id][field] = dateStr;
  saveLifecycleStore(store);
}

function getLifecycle(orderId) {
  const store = getLifecycleStore();
  return store[String(orderId)] || {};
}

// Thêm bản ghi lịch sử trạng thái (không ghi đè)
function pushLifecycleEvent(orderId, status, dateStr) {
  const store = getLifecycleStore();
  const id = String(orderId);
  store[id] = store[id] || {};
  const history = Array.isArray(store[id].history) ? store[id].history : [];
  history.push({ status, at: dateStr });
  store[id].history = history;
  saveLifecycleStore(store);
}

// Hàm cập nhật trạng thái đơn hàng + lưu mốc thời gian
async function updateStatus(orderId, newStatus) {
  const response = await fetch(`http://localhost:8000/api/order/${orderId}/update_status/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  if (response.ok) {
    const nowIso = new Date().toISOString();
    if (newStatus === "Pending from Inventory") {
      setLifecycleDate(orderId, "inventory_date", nowIso);
    }
    // Lưu lịch sử đầy đủ
    pushLifecycleEvent(orderId, newStatus, nowIso);
    window.location.reload();
  } else {
    alert("Cập nhật trạng thái thất bại!");
  }
}

// Định dạng ngày về dạng YYYY-MM-DD
function formatDate(dateStr) {
  if (!dateStr) return "";
  // Nếu API trả ISO có chữ 'T', cắt 10 ký tự đầu
  if (typeof dateStr === "string" && dateStr.includes("T")) {
    return dateStr.slice(0, 10);
  }
  // Fallback: parse Date rồi chuyển ISO và cắt 10 ký tự
  try {
    return new Date(dateStr).toISOString().slice(0, 10);
  } catch (e) {
    return "";
  }
}

function renderLifecycleDates(order) {
  const lc = getLifecycle(order.id);
  const parts = [];
  const created = formatDate(order.created_at);
  if (created) parts.push({ label: "Created", value: created });

  // Nếu có lịch sử thì ưu tiên hiển thị đầy đủ theo thứ tự
  if (Array.isArray(lc.history) && lc.history.length) {
    const labelMap = {
      "Paid": "Paid",
      "Pending from Inventory": "Inventory",
      "Pending from Delivery": "Pending Delivery",
      "Shipping": "Shipped",
      "Completed": "Completed",
      "Cancelled": "Failed",
    };
    lc.history.forEach((item, idx) => {
      const label = labelMap[item.status] || item.status;
      parts.push({ label, value: formatDate(item.at) });
    });
  } else {
    // Fallback: hiển thị theo các field đơn lẻ đã lưu trước đây
    if (lc.inventory_date) parts.push({ label: "Inventory", value: formatDate(lc.inventory_date) });
    if (lc.shipped_date) parts.push({ label: "Shipped", value: formatDate(lc.shipped_date) });
    if (lc.completed_date) parts.push({ label: "Completed", value: formatDate(lc.completed_date) });
    if (lc.failed_date) parts.push({ label: "Failed", value: formatDate(lc.failed_date) });
  }

  return parts.length ? parts.map((p, i) => (<div key={i}>{`${p.label}: ${p.value}`}</div>)) : created;
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
        const response = await fetch("http://localhost:8000/api/order/get_all_orders/");
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
              <th className="px-4 py-2">Dates</th>
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
                    <div>{(order.user && order.user.username) || order.customer_username || order.customer_name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{order.customer_email}</div>
                    <div className="text-xs text-gray-500">{order.customer_phone}</div>
                  </td>
                  <td className="border px-4 py-2">{order.id}</td>
                  <td className="border px-4 py-2">{order.amount} {order.currency}</td>
                  <td className={`border px-4 py-2 font-bold rounded ${STATUS_COLORS[order.status] || "bg-gray-300"}`}>{order.status}</td>
                  <td className="border px-4 py-2">{renderLifecycleDates(order)}</td>
                  <td className="border px-4 py-2">
                    <NavLink
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-black bg-yellow-400 hover:bg-yellow-500 transition mr-2"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </NavLink>
                    {/* Action buttons for each status and role */}
                    {/* Paid: show actions for Sale Staff/Admin */}
                    {order.status === "Paid" && (
                      <>
                        <Button size="small" className="mr-2 bg-yellow-400 text-black" onClick={() => updateStatus(order.id, "Pending from Inventory")}>Send to Inventory</Button>
                        <Button size="small" className="mr-2 bg-red-500 text-white" onClick={() => updateStatus(order.id, "Cancelled")}>Cancel Order</Button>
                      </>
                    )}
                    {/* Pending from Inventory: no actions for Orders page */}
                    {order.status === "Pending from Inventory" && null}
                    {/* Pending from Delivery: no actions for Orders page */}
                    {order.status === "Pending from Delivery" && null}
                    {/* Shipping: no actions for Orders page */}
                    {order.status === "Shipping" && null}
                    {/* Completed: disabled button */}
                    {order.status === "Completed" && (
                      <Button size="small" className="mr-2 bg-red-500 text-white" disabled>Order Completed</Button>
                    )}
                    {/* Cancelled: disabled button */}
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
