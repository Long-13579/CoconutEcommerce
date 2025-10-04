import React, { useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody, Button } from "@windmill/react-ui";

// Helpers lưu/đọc lịch sử vòng đời đơn hàng (dùng chung logic với Orders/Delivery)
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

function pushLifecycleEvent(orderId, status, dateStr) {
    const store = getLifecycleStore();
    const id = String(orderId);
    store[id] = store[id] || {};
    const history = Array.isArray(store[id].history) ? store[id].history : [];
    history.push({ status, at: dateStr });
    store[id].history = history;
    saveLifecycleStore(store);
}

function getLifecycle(orderId) {
    const store = getLifecycleStore();
    return store[String(orderId)] || {};
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    if (typeof dateStr === "string" && dateStr.includes("T")) {
        return dateStr.slice(0, 10);
    }
    try {
        return new Date(dateStr).toISOString().slice(0, 10);
    } catch (e) {
        return "";
    }
}

function renderInventoryDates(order) {
    const lc = getLifecycle(order.id);
    const lines = [];
    if (lc.inventory_date) lines.push(`Inventory Request Date: ${formatDate(lc.inventory_date)}`);
    if (lc.packed_date) {
        lines.push(`Packing Date: ${formatDate(lc.packed_date)}`);
    } else if (lc.failed_date) {
        lines.push(`Cancelled: ${formatDate(lc.failed_date)}`);
    }
    if (lc.handover_date) lines.push(`Hand-over Date: ${formatDate(lc.handover_date)}`);
    return lines.length ? lines.map((t, i) => (<div key={i}>{t}</div>)) : null;
}

// Update order status via API
async function updateOrderStatus(orderId, newStatus) {
    const response = await fetch(`http://localhost:8000/api/order/${orderId}/update_status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
        const nowIso = new Date().toISOString();
        if (newStatus === "Pending from Delivery") {
            setLifecycleDate(orderId, "handover_date", nowIso);
            pushLifecycleEvent(orderId, newStatus, nowIso);
        }
        if (newStatus === "Cancelled") {
            setLifecycleDate(orderId, "failed_date", nowIso);
            pushLifecycleEvent(orderId, newStatus, nowIso);
        }
        window.location.reload();
    } else {
        alert("Failed to update order status.");
    }
}

function ProductsInventory() {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("pending");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [version, setVersion] = useState(0);

    // ✅ Hàm kiểm kho và cập nhật
    const handlePacked = async (order) => {
        try {
            const items = order.items.map(i => ({
                product_id: i.product.id,
                quantity: i.quantity
            }));

            const res = await fetch("http://localhost:8000/api/products/check_and_update_inventory/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items })
            });

            const data = await res.json();

            if (data.status === "success") {
                alert("✅ Inventory check successful! Quantities updated.");
                const nowIso = new Date().toISOString();
                setLifecycleDate(order.id, "packed_date", nowIso);
                pushLifecycleEvent(order.id, "Packed", nowIso);
                setVersion(v => v + 1);
            } else if (data.status === "failed") {
                const missing = data.insufficient
                    .map(p => `- ${p.name} (needed ${p.needed}, available ${p.available})`)
                    .join("\n");
                alert("⚠️ Some products are out of stock:\n" + missing);
            } else {
                alert("Unexpected response from server");
            }
        } catch (err) {
            console.error(err);
            alert("Error checking inventory: " + err.message);
        }
    };

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
    }, [version]);

    return (
        <div className="w-full flex flex-col flex-grow">
            <PageTitle>Inventory Check</PageTitle>
            <Card className="mb-6">
                <CardBody>
                    <div className="mb-4 flex gap-2">
                        <button
                            className={`px-4 py-2 rounded ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("pending")}
                        >
                            Processing
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${activeTab === "processed" ? "bg-green-700 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("processed")}
                        >
                            Completed
                        </button>
                    </div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-red-600">{error}</div>
                    ) : orders.length === 0 ? (
                        <div>No orders found.</div>
                    ) : (
                        <table className="min-w-full table-auto bg-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Order ID</th>
                                    <th className="px-4 py-2">Client</th>
                                    <th className="px-4 py-2">Products</th>
                                    <th className="px-4 py-2">Dates</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders
                                    .filter(order => {
                                        if (activeTab === "pending") {
                                            return order.status === "Pending from Inventory";
                                        } else {
                                            return ["Pending from Delivery", "Shipping", "Completed", "Cancelled"].includes(order.status);
                                        }
                                    })
                                    .map(order => (
                                        <tr key={order.id}>
                                            <td className="border px-4 py-2">{order.id}</td>
                                            <td className="border px-4 py-2">{order.customer_email}</td>
                                            <td className="border px-4 py-2">
                                                <ul>
                                                    {order.items.map(item => (
                                                        <li key={item.id}>
                                                            {item.product.name} (Qty: {item.quantity})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="border px-4 py-2">{renderInventoryDates(order)}</td>
                                            <td className="border px-4 py-2">
                                                {order.status === "Pending from Inventory" && (
                                                    <>
                                                        <Button
                                                            size="small"
                                                            className={`mr-2 text-white ${getLifecycle(order.id).packed_date
                                                                ? "bg-blue-300 cursor-not-allowed opacity-60"
                                                                : "bg-blue-400"
                                                                }`}
                                                            onClick={() => handlePacked(order)}
                                                            disabled={!!getLifecycle(order.id).packed_date}
                                                        >
                                                            Packed
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            className={`mr-2 text-white ${getLifecycle(order.id).packed_date
                                                                ? "bg-green-600"
                                                                : "bg-green-300 cursor-not-allowed opacity-60"
                                                                }`}
                                                            onClick={() => getLifecycle(order.id).packed_date && updateOrderStatus(order.id, "Pending from Delivery")}
                                                            disabled={!getLifecycle(order.id).packed_date}
                                                        >
                                                            Handover for delivery
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            className="bg-red-500 text-white"
                                                            onClick={() => updateOrderStatus(order.id, "Cancelled")}
                                                        >
                                                            Out of Stock
                                                        </Button>
                                                    </>
                                                )}
                                                {order.status !== "Pending from Inventory" && (
                                                    <>
                                                        {(["Pending from Delivery", "Shipping", "Completed"].includes(order.status)) && (
                                                            <span className="text-green-700 font-medium">Order Handed Over to delivery</span>
                                                        )}
                                                        {order.status === "Cancelled" && (
                                                            <span className="text-red-600 font-medium">Order Rejected</span>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}

export default ProductsInventory;
