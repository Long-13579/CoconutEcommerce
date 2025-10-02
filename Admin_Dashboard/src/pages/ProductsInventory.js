
import React, { useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody, Button } from "@windmill/react-ui";

// Update order status via API
async function updateOrderStatus(orderId, newStatus) {
    const response = await fetch(`http://localhost:8000/api/order/${orderId}/update_status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
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

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            setError(null);
            try {
                // Get orders with status 'Pending from Inventory'
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

    return (
        <div className="w-full flex flex-col flex-grow">
            <PageTitle>Inventory Check</PageTitle>
            <Card className="mb-6">
                <CardBody>
                    <div className="mb-4 flex gap-2">
                        <button
                            className={`px-4 py-2 rounded ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("pending")}
                        >Processing</button>
                        <button
                            className={`px-4 py-2 rounded ${activeTab === "processed" ? "bg-green-700 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("processed")}
                        >Completed</button>
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
                                            <td className="border px-4 py-2">
                                                {order.status === "Pending from Inventory" && (
                                                    <>
                                                        <Button size="small" className="mr-2 bg-blue-400 text-white" onClick={() => updateOrderStatus(order.id, "Pending from Delivery")}>Packed</Button>
                                                        <Button size="small" className="bg-red-500 text-white" onClick={() => updateOrderStatus(order.id, "Cancelled")}>Out of Stock</Button>
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
