
import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody, Label, Select, Input, Button } from "@windmill/react-ui";
import { NavLink } from "react-router-dom";

const STATUS_COLORS = {
  Paid: "bg-green-500 text-white",
  "Awaiting Confirmation": "bg-green-400 text-white",
  Processing: "bg-yellow-400 text-black",
  Shipping: "bg-blue-500 text-white",
  Completed: "bg-green-700 text-white",
  Cancelled: "bg-red-500 text-white",
  Returned: "bg-red-400 text-black",
  Disputed: "bg-red-700 text-white",
};

const statusOptions = [
  "All",
  "Paid",
  "Awaiting Confirmation",
  "Processing",
  "Shipping",
  "Completed",
  "Cancelled",
  "Returned",
  "Disputed",
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
        // Replace with your actual API endpoint
        const response = await fetch("/api/order/get_orders/");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
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
                    <NavLink to={`/orders/${order.id}`} className="text-blue-600 underline mr-2">View</NavLink>
                    {/* Add more action buttons here based on role and status */}
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
