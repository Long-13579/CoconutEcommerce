
import React, { useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";

function Delivery() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDeliveries() {
            setLoading(true);
            setError(null);
            try {
                // Use trailing slash for Django API endpoint
                const response = await fetch("/api/delivery/get_deliveries/");
                const contentType = response.headers.get("content-type");
                if (!response.ok) throw new Error("Failed to fetch deliveries");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    setDeliveries(data);
                } else {
                    // If response is HTML, show error
                    const text = await response.text();
                    setError("API returned HTML: " + text.substring(0, 100));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchDeliveries();
    }, []);

    return (
        <div className="w-full flex flex-col flex-grow">
            <PageTitle>Delivery</PageTitle>
            <main className="flex flex-col flex-grow">
                <div className="mt-6 bg-white rounded shadow p-6 w-full flex flex-col flex-grow">
                    <h2 className="text-lg font-bold mb-4">Delivery Management</h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-red-600">{error}</div>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">ID</th>
                                    <th className="px-4 py-2">Order</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Assigned To</th>
                                    <th className="px-4 py-2">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">No deliveries found.</td>
                                    </tr>
                                ) : (
                                    deliveries.map((delivery) => (
                                        <tr key={delivery.id}>
                                            <td className="border px-4 py-2">{delivery.id}</td>
                                            <td className="border px-4 py-2">
                                                {delivery.order && delivery.order.stripe_checkout_id ? (
                                                    <span>
                                                        #{delivery.order.id} - {delivery.order.stripe_checkout_id} ({delivery.order.status})
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic">No order</span>
                                                )}
                                            </td>
                                            <td className="border px-4 py-2">{delivery.status}</td>
                                            <td className="border px-4 py-2">
                                                {delivery.assigned_to && delivery.assigned_to.email ? (
                                                    <span>{delivery.assigned_to.email}</span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="border px-4 py-2">{delivery.created_at}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Delivery;
