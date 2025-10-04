import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import ChartCard from "../components/Chart/ChartCard";
import { Line, Bar } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import {
  lineOptions,
  lineLegends,
  realTimeUsersBarLegends,
  realTimeUsersBarOptions,
} from "../utils/demo/chartsData";


const Customers = () => {
  const [activeTab, setActiveTab] = useState("basic"); 
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStatus, setEditingStatus] = useState({}); // { [customerId]: true/false }
  const [pendingStatus, setPendingStatus] = useState({}); // { [customerId]: "Active"|... }
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Quyền: chỉ admin hoặc superuser được cập nhật
  const storedRole =
    (typeof localStorage !== "undefined" && (localStorage.getItem("role") || localStorage.getItem("user_role"))) ||
    (typeof sessionStorage !== "undefined" && (sessionStorage.getItem("role") || sessionStorage.getItem("user_role"))) ||
    "";
  const storedIsSuper =
    (typeof localStorage !== "undefined" && (localStorage.getItem("is_superuser") || "")) ||
    (typeof sessionStorage !== "undefined" && (sessionStorage.getItem("is_superuser") || "")) ||
    "";
  const canManage = (storedRole || "").toLowerCase() === "admin" || String(storedIsSuper).toLowerCase() === "true";

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8000/api/users/list/");
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const text = await res.text();
          setError("API error: " + text.substring(0, 150));
          return;
        }
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          setCustomers(Array.isArray(data) ? data : []);
        } else {
          const text = await res.text();
          setError("API returned HTML: " + text.substring(0, 150));
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <div>
      <PageTitle>Manage Customers</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="User Details">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>

        <ChartCard title="Online Visitors">
          <Bar {...realTimeUsersBarOptions} />
          <ChartLegend legends={realTimeUsersBarLegends} />
        </ChartCard>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded ${activeTab === "basic" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("basic")}
        >Basic Info</button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("orders")}
        >Orders Overview</button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "activity" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("activity")}
        >Customer Activity & CRM Info</button>
      </div>

      {activeTab === "basic" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Customer ID</th>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Joined Date</th>
                <th className="px-4 py-2">Account Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="text-center py-6" colSpan={7}>Loading...</td></tr>
              ) : error ? (
                <tr><td className="text-center text-red-600 py-6" colSpan={7}>{error}</td></tr>
              ) : customers.length === 0 ? (
                <tr><td className="text-center py-6" colSpan={8}>No data</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id}>
                    <td className="border px-4 py-2">{c.id}</td>
                    <td className="border px-4 py-2">{c.username || "N/A"}</td>
                    <td className="border px-4 py-2">{c.email}</td>
                    <td className="border px-4 py-2">{c.phone || ""}</td>
                    <td className="border px-4 py-2">{c.address || ""}</td>
                    <td className="border px-4 py-2">{c.joined_on || ""}</td>
                    <td className="border px-4 py-2">
                      {editingStatus[c.id] ? (
                        <select
                          className="px-2 py-1 rounded border"
                          value={pendingStatus[c.id] ?? (c.account_status || (c.state ? "Active" : "Inactive"))}
                          onChange={(e) => {
                            const { value } = e.target;   // copy ra biến trước
                            setPendingStatus(prev => ({ ...prev, [c.id]: value }));
                          }}                          
                        >
                          <option>Active ✅</option>
                          <option>Inactive ⏸️</option>
                          <option>Blocked 🚫</option>
                          <option>Deleted 🗑️</option>
                        </select>
                      ) : (
                        <span>{pendingStatus[c.id] ?? (c.account_status || (c.state ? "Active" : "Inactive"))}</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className="mr-2 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => { setSelectedCustomer(c); setDetailOpen(true); }}
                      >Details</button>
                      {editingStatus[c.id] ? (
                        <>
                          <button
                            className="mr-2 px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                            onClick={async () => {
                              const raw = pendingStatus[c.id] ?? (c.account_status || (c.state ? "Active" : "Inactive"));
                              // Normalize value without emoji for backend
                              const normalized = raw.split(" ")[0];
                              
                              // Nếu chọn "Deleted", xóa tài khoản thay vì cập nhật status
                              if (normalized === "Deleted") {
                                if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản của ${c.username || c.email}? Hành động này không thể hoàn tác!`)) {
                                  try {
                                    const token =
                                      (typeof localStorage !== "undefined" && (localStorage.getItem("access") || localStorage.getItem("token"))) ||
                                      (typeof sessionStorage !== "undefined" && (sessionStorage.getItem("access") || sessionStorage.getItem("token"))) ||
                                      "";
                                    const deleteRes = await fetch(`http://localhost:8000/api/users/users/${c.id}/`, {
                                      method: "DELETE",
                                      headers: {
                                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                                      }
                                    });
                                    if (!deleteRes.ok) {
                                      const text = await deleteRes.text();
                                      alert("Xóa tài khoản thất bại: " + text.substring(0, 120));
                                      return;
                                    }
                                    // Xóa khỏi danh sách local
                                    setCustomers(prev => prev.filter(u => u.id !== c.id));
                                    setEditingStatus(prev => ({ ...prev, [c.id]: false }));
                                    alert("✅ Đã xóa tài khoản thành công!");
                                  } catch (e) {
                                    alert("Lỗi mạng khi xóa tài khoản");
                                  }
                                } else {
                                  // Người dùng hủy xóa, đóng edit mode
                                  setEditingStatus(prev => ({ ...prev, [c.id]: false }));
                                }
                                return;
                              }
                              
                              // Các trường hợp khác (Active, Inactive, Blocked) - cập nhật status
                              try {
                                const token =
                                  (typeof localStorage !== "undefined" && (localStorage.getItem("access") || localStorage.getItem("token"))) ||
                                  (typeof sessionStorage !== "undefined" && (sessionStorage.getItem("access") || sessionStorage.getItem("token"))) ||
                                  "";
                                const res = await fetch(`http://localhost:8000/api/users/update_status/${c.id}/`, {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                                  },
                                  body: JSON.stringify({ status: raw })
                                });
                                if (!res.ok) {
                                  const text = await res.text();
                                  alert("Update failed: " + text.substring(0, 120));
                                  return;
                                }
                                const data = await res.json();
                                setCustomers(prev => prev.map(u => u.id === c.id ? { ...u, account_status: data.account_status, state: data.account_status === "Active" } : u));
                                setEditingStatus(prev => ({ ...prev, [c.id]: false }));
                              } catch (e) {
                                alert("Network error");
                              }
                            }}
                          >Save</button>
                          <button
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => setEditingStatus(prev => ({ ...prev, [c.id]: false }))}
                          >Cancel</button>
                        </>
                      ) : (
                        canManage ? ( //ẩn nút update status cho user không phải admin hoặc superuser
                          <button
                            className="px-2 py-1 rounded bg-yellow-400 text-black hover:bg-yellow-500"
                            onClick={() => setEditingStatus(prev => ({ ...prev, [c.id]: true }))}
                          >Update Status</button>
                        ) : null
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : activeTab === "orders" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Customer ID</th>
                <th className="px-4 py-2">Total Orders</th>
                <th className="px-4 py-2">Lifetime Value</th>
                <th className="px-4 py-2">Latest Order Status</th>
                <th className="px-4 py-2">Order History</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center py-6" colSpan={5}>No data</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Customer ID</th>
                <th className="px-4 py-2">Cancelled Orders</th>
                <th className="px-4 py-2">Loyalty Points</th>
                <th className="px-4 py-2">Customer Reviews</th>
                <th className="px-4 py-2">Customer Segment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center py-6" colSpan={5}>No data</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {detailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setDetailOpen(false)}></div>
          <div className="relative bg-white rounded shadow-lg w-full max-w-4xl mx-4 p-6 overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Customer Details</h2>
              <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setDetailOpen(false)}>Close</button>
            </div>
            {/* Profile Info */}
            <div className="mb-6">
              <h3 className="text-md font-bold mb-2">Profile Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><span className="font-medium">Full Name:</span> {selectedCustomer?.username || "N/A"}</div>
                <div><span className="font-medium">Email:</span> {selectedCustomer?.email || ""}</div>
                <div><span className="font-medium">Phone:</span> {selectedCustomer?.phone || ""}</div>
                <div><span className="font-medium">Default Address:</span> {selectedCustomer?.address || ""}</div>
                <div><span className="font-medium">Joined:</span> {selectedCustomer?.joined_on || ""}</div>
                <div><span className="font-medium">Status:</span> {selectedCustomer?.account_status || (selectedCustomer?.state ? "Active" : "Inactive")}</div>
              </div>
            </div>
            {/* Order History */}
            <div className="mb-6">
              <h3 className="text-md font-bold mb-2">Order History</h3>
              <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><span className="font-medium">Total Orders:</span> 0</div>
                <div><span className="font-medium">Lifetime Value:</span> 0</div>
                <div><span className="font-medium">Latest Order Status:</span> -</div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white rounded border">
                  <thead>
                    <tr>
                      <th className="px-3 py-2">Order ID</th>
                      <th className="px-3 py-2">Placed Date</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center py-4" colSpan={4}>No orders</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Payment & Loyalty */}
            <div className="mb-6">
              <h3 className="text-md font-bold mb-2">Payment & Loyalty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><span className="font-medium">Preferred Payment Method:</span> -</div>
                <div><span className="font-medium">Loyalty Points:</span> 0</div>
                <div><span className="font-medium">Vouchers:</span> -</div>
                <div><span className="font-medium">Cancelled Orders:</span> 0</div>
              </div>
            </div>
            {/* CRM Info */}
            <div className="mb-2">
              <h3 className="text-md font-bold mb-2">CRM</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><span className="font-medium">Customer Segment:</span> -</div>
                <div><span className="font-medium">Engagement (logins/orders):</span> -</div>
                <div className="md:col-span-2"><span className="font-medium">Internal Notes:</span>
                  <div className="mt-1 p-2 border rounded text-sm text-gray-700">-</div>
                </div>
                <div className="md:col-span-2"><span className="font-medium">Customer Reviews:</span>
                  <div className="mt-1 p-2 border rounded text-sm text-gray-700">No reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
