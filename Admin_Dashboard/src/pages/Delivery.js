

import React, { useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import { ReactComponent as EyeIcon } from "../icons/eye.svg";

// Helpers lưu/đọc mốc thời gian vòng đời đơn hàng (dùng chung với Orders)
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

// Định dạng ngày về dạng YYYY-MM-DD
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

// Update order status via API
async function updateOrderStatus(orderId, newStatus) {
    const response = await fetch(`http://localhost:8000/api/order/${orderId}/update_status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
        const nowIso = new Date().toISOString();
        if (newStatus === "Shipping") {
            setLifecycleDate(orderId, "shipped_date", nowIso);
        } else if (newStatus === "Completed") {
            setLifecycleDate(orderId, "completed_date", nowIso);
        } else if (newStatus === "Cancelled") {
            setLifecycleDate(orderId, "failed_date", nowIso);
        }
        // Lưu lịch sử đầy đủ
        pushLifecycleEvent(orderId, newStatus, nowIso);
        window.location.reload();
    } else {
        alert("Failed to update order status.");
    }
}

function Delivery() {
    const STATUS_COLORS = {
        Paid: "bg-green-500 text-white",
        "Pending from Inventory": "bg-yellow-400 text-black",
        "Pending from Delivery": "bg-blue-400 text-white",
        Shipping: "bg-blue-500 text-white",
        Completed: "bg-green-700 text-white",
        Cancelled: "bg-red-500 text-white",
    };
    const [deliveries, setDeliveries] = useState([]);
    const [activeTab, setActiveTab] = useState("pending");
    const [selectedShipper, setSelectedShipper] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assigning, setAssigning] = useState({});
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [failureReason, setFailureReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [failureReasons, setFailureReasons] = useState({}); // Lưu lý do thất bại cho từng delivery
    // ...existing code...

    useEffect(() => {
        async function fetchDeliveries() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("http://localhost:8000/api/delivery/get_deliveries/");
                const contentType = response.headers.get("content-type");
                if (!response.ok) {
                    const text = await response.text();
                    setError("API error: " + text.substring(0, 100));
                    return;
                }
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    setDeliveries(data);
                    // Set initial selected shipper for each delivery
                    const initialSelected = {};
                    // Load saved assignments from localStorage to persist through reloads
                    let savedAssignments = {};
                    try {
                        savedAssignments = JSON.parse(localStorage.getItem("assignedShippers") || "{}");
                    } catch (_) {
                        savedAssignments = {};
                    }
                    data.forEach(d => {
                        if (d.order && (d.order.status === "Pending from Delivery")) {
                            initialSelected[d.id] = d.assigned_to && d.assigned_to.email
                                ? d.assigned_to.email
                                : (savedAssignments[d.id] || "");
                        } else if (d.order && (d.order.status === "Shipping" || d.order.status === "Completed" || d.order.status === "Cancelled")) {
                            // For non-pending statuses, prefer backend value, fallback to saved
                            const backendEmail = d.assigned_to && d.assigned_to.email ? d.assigned_to.email : "";
                            initialSelected[d.id] = backendEmail || savedAssignments[d.id] || "";
                        }
                    });
                    setSelectedShipper(initialSelected);
                    
                    // Load saved failure reasons from localStorage
                    try {
                        const savedReasons = JSON.parse(localStorage.getItem("deliveryFailureReasons") || "{}");
                        setFailureReasons(savedReasons);
                    } catch (e) {
                        console.error("Failed to load failure reasons:", e);
                    }
                } else {
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

    // Assign delivery staff (for demo, just assign current user)
    // Sample shipper list
    const sampleShippers = [
        { email: "shipper1@example.com", name: "Shipper One" },
        { email: "shipper2@example.com", name: "Shipper Two" },
        { email: "shipper3@example.com", name: "Shipper Three" },
    ];

    async function assignDelivery(deliveryId, userEmail) {
        setAssigning(prev => ({ ...prev, [deliveryId]: true }));
        await fetch(`http://localhost:8000/api/delivery/${deliveryId}/update/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assigned_to: userEmail }),
        });
        setAssigning(prev => ({ ...prev, [deliveryId]: false }));
        setSelectedShipper(prev => ({ ...prev, [deliveryId]: userEmail }));
        // Optionally, refresh deliveries after assignment
        // window.location.reload();

        // Persist assignment locally so it stays visible in Completed tab after reload
        try {
            const saved = JSON.parse(localStorage.getItem("assignedShippers") || "{}");
            saved[deliveryId] = userEmail;
            localStorage.setItem("assignedShippers", JSON.stringify(saved));
        } catch (_) {
            // ignore storage errors
        }

    }

    // Handle failed delivery with reason
    const handleFailedDelivery = (delivery) => {
        setSelectedDelivery(delivery);
        setShowFailureModal(true);
        setFailureReason("");
        setCustomReason("");
    };

    const confirmFailedDelivery = () => {
        if (!failureReason && !customReason) {
            alert("Vui lòng chọn lý do thất bại hoặc nhập lý do khác");
            return;
        }
        
        const reason = failureReason === "other" ? customReason : failureReason;
        console.log(`Delivery failed for order ${selectedDelivery.order.id}: ${reason}`);
        
        // Lưu lý do thất bại vào state
        setFailureReasons(prev => ({
            ...prev,
            [selectedDelivery.id]: reason
        }));
        
        // Lưu vào localStorage để persist qua reload
        try {
            const savedReasons = JSON.parse(localStorage.getItem("deliveryFailureReasons") || "{}");
            savedReasons[selectedDelivery.id] = reason;
            localStorage.setItem("deliveryFailureReasons", JSON.stringify(savedReasons));
        } catch (e) {
            console.error("Failed to save failure reason:", e);
        }
        
        // Update order status to Cancelled
        updateOrderStatus(selectedDelivery.order.id, "Cancelled");
        
        // Close modal
        setShowFailureModal(false);
        setSelectedDelivery(null);
        setFailureReason("");
        setCustomReason("");
    };

    // Remove updateDeliveryStatus, use updateOrderStatus for workflow actions
    // Tracking info button removed as requested

    return (
        <div className="w-full flex flex-col flex-grow">
            <PageTitle>Delivery</PageTitle>
            <main className="flex flex-col flex-grow">
                <div className="mt-6 bg-white rounded shadow p-6 w-full flex flex-col flex-grow">
                    <h2 className="text-lg font-bold mb-4">Delivery Management</h2>
                    <div className="mb-4 flex gap-2">
                        <button
                            className={`px-4 py-2 rounded ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("pending")}
                        >Processing</button>
                        <button
                            className={`px-4 py-2 rounded ${activeTab === "completed" ? "bg-green-700 text-white" : "bg-gray-200"}`}
                            onClick={() => setActiveTab("completed")}
                        >Completed</button>
                    </div>
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
                                    <th className="px-4 py-2">Dates</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">No deliveries found.</td>
                                    </tr>
                                ) : (
                                    deliveries
                                        .filter(delivery => {
                                            if (activeTab === "pending") {
                                                return delivery.order && (delivery.order.status === "Pending from Delivery" || delivery.order.status === "Shipping");
                                            } else {
                                                return delivery.order && (delivery.order.status === "Completed" || delivery.order.status === "Cancelled");
                                            }
                                        })
                                        .map((delivery) => (
                                            <tr key={delivery.id}>
                                                <td className="border px-4 py-2">{delivery.id}</td>
                                                <td className="border px-4 py-2">
                                                    {delivery.order && delivery.order.checkout_id ? (
                                                        <span>
                                                            #{delivery.order.id} - {delivery.order.checkout_id} <span className={`ml-2 px-2 py-1 rounded ${STATUS_COLORS[delivery.order.status] || "bg-gray-300"}`}>{delivery.order.status}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">No order</span>
                                                    )}
                                                </td>
                                                <td className="border px-4 py-2">{delivery.status}</td>
                                                <td className="border px-4 py-2">
                                                    {/* Always show assigned shipper for all statuses */}
                                                    {delivery.order && delivery.order.status === "Pending from Delivery" ? (
                                                        <>
                                                            <select
                                                                className="px-2 py-1 rounded border mr-2"
                                                                value={selectedShipper[delivery.id] || delivery.assigned_to?.email || ""}
                                                                onChange={e => {
                                                                    e.persist && e.persist();
                                                                    if (e.target && typeof e.target.value !== "undefined") {
                                                                        setSelectedShipper(prev => ({ ...prev, [delivery.id]: e.target.value }));
                                                                        if (e.target.value && e.target.value !== (delivery.assigned_to && delivery.assigned_to.email)) {
                                                                            assignDelivery(delivery.id, e.target.value);
                                                                        }
                                                                    }
                                                                }}
                                                                disabled={assigning[delivery.id]}
                                                            >
                                                                <option value="" disabled>Choose shipper</option>
                                                                {sampleShippers.map(shipper => (
                                                                    <option key={shipper.email} value={shipper.email}>{shipper.name}</option>
                                                                ))}
                                                            </select>
                                                        </>
                                                    ) : null}
                                                    {/* Always show shipper for all statuses, not just Pending from Delivery */}
                                                    <span>
                                                        {delivery.assigned_to && delivery.assigned_to.email
                                                            ? delivery.assigned_to.email
                                                            : (selectedShipper[delivery.id] || "")}
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {(() => {
                                                        if (!delivery.order) return null;
                                                        const lcStoreRaw = localStorage.getItem("orderLifecycleDates") || "{}";
                                                        let lcStore = {};
                                                        try { lcStore = JSON.parse(lcStoreRaw); } catch (_) { lcStore = {}; }
                                                        const lc = lcStore[String(delivery.order.id)] || {};
                                                        const items = [];
                                                        if (lc.shipped_date) items.push(`Start Shipping: ${formatDate(lc.shipped_date)}`);
                                                        if (lc.completed_date) items.push(`Delivered: ${formatDate(lc.completed_date)}`);
                                                        if (lc.failed_date) items.push(`Failed: ${formatDate(lc.failed_date)}`);
                                                        return items.length ? items.map((t, i) => (<div key={i}>{t}</div>)) : null;
                                                    })()}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {/* View Details Button */}
                                                    {delivery.order && (
                                                        <NavLink
                                                            to={`/orders/${delivery.order.id}?from=delivery`}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-black bg-yellow-400 hover:bg-yellow-500 transition mr-2"
                                                            title="Xem chi tiết"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </NavLink>
                                                    )}
                                                    
                                                    {/* Show Start Shipping if status is Pending from Delivery and shipper is selected (assigned_to or selectedShipper) */}
                                                    {delivery.order && delivery.order.status === "Pending from Delivery" && ((delivery.assigned_to && delivery.assigned_to.email) || selectedShipper[delivery.id]) && (
                                                        <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => updateOrderStatus(delivery.order.id, "Shipping")}>Start Shipping</button>
                                                    )}
                                                    {/* Show Successful Delivery for Shipping */}
                                                    {delivery.order && delivery.order.status === "Shipping" && (
                                                        <>
                                                            <button className="bg-green-700 text-white px-2 py-1 rounded mr-2" onClick={() => updateOrderStatus(delivery.order.id, "Completed")}>Successful Delivery</button>
                                                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleFailedDelivery(delivery)}>Failed Delivery</button>
                                                        </>
                                                    )}
                                                    {/* Completed/Cancelled status */}
                                                    {delivery.order && delivery.order.status === "Completed" && (
                                                        <span className="text-green-700 font-medium">Order Delivered Successfully</span>
                                                    )}
                                                    {delivery.order && delivery.order.status === "Cancelled" && (
                                                        <div className="text-red-600 font-medium">
                                                        <div>Order Delivery Failed</div>
                                                        {(() => {
                                                            // Lấy lý do từ state hoặc localStorage
                                                            const reason = failureReasons[delivery.id] || 
                                                                (() => {
                                                                    try {
                                                                        const saved = JSON.parse(localStorage.getItem("deliveryFailureReasons") || "{}");
                                                                        return saved[delivery.id];
                                                                    } catch (e) {
                                                                        return null;
                                                                    }
                                                                })();
                                                            
                                                            return reason ? (
                                                                <div className="text-sm text-gray-600 mt-1">
                                                                    <strong>Lý do:</strong> {reason}
                                                                </div>
                                                            ) : null;
                                                        })()}
                                                    </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* Failure Reason Modal */}
            {showFailureModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowFailureModal(false)}></div>
                  <div className="relative bg-white rounded shadow-lg w-full max-w-md mx-4 p-6">
                      <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold">Lý do giao hàng thất bại</h2>
                          <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowFailureModal(false)}>×</button>
                      </div>
                      
                      <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">Chọn lý do thất bại:</label>
                          <select 
                              className="w-full p-2 border rounded"
                              value={failureReason}
                              onChange={(e) => setFailureReason(e.target.value)}
                          >
                              <option value="">-- Chọn lý do --</option>
                              <option value="Người nhận sai địa chỉ">Người nhận sai địa chỉ</option>
                              <option value="Người nhận không nhận đơn hàng">Người nhận không nhận đơn hàng</option>
                              <option value="Địa chỉ không tồn tại">Địa chỉ không tồn tại</option>
                              <option value="Không liên lạc được người nhận">Không liên lạc được người nhận</option>
                              <option value="Sản phẩm bị hỏng trong quá trình vận chuyển">Sản phẩm bị hỏng trong quá trình vận chuyển</option>
                              <option value="other">Lý do khác</option>
                          </select>
                      </div>
                      
                      {failureReason === "other" && (
                          <div className="mb-4">
                              <label className="block text-sm font-medium mb-2">Nhập lý do khác:</label>
                              <textarea
                                  className="w-full p-2 border rounded"
                                  rows="3"
                                  value={customReason}
                                  onChange={(e) => setCustomReason(e.target.value)}
                                  placeholder="Nhập lý do thất bại..."
                              />
                          </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                          <button 
                              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                              onClick={() => setShowFailureModal(false)}
                          >
                              Hủy
                          </button>
                          <button 
                              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                              onClick={confirmFailedDelivery}
                          >
                              Xác nhận thất bại
                          </button>
                      </div>
                  </div>
              </div>
          )}
     </div>
    );
    
}

export default Delivery;
