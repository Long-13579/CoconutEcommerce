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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="text-center py-6" colSpan={7}>Loading...</td></tr>
              ) : error ? (
                <tr><td className="text-center text-red-600 py-6" colSpan={7}>{error}</td></tr>
              ) : customers.length === 0 ? (
                <tr><td className="text-center py-6" colSpan={7}>No data</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id}>
                    <td className="border px-4 py-2">{c.id}</td>
                    <td className="border px-4 py-2">{c.username || "N/A"}</td>
                    <td className="border px-4 py-2">{c.email}</td>
                    <td className="border px-4 py-2">{c.phone || ""}</td>
                    <td className="border px-4 py-2">{c.address || ""}</td>
                    <td className="border px-4 py-2">{c.joined_on || ""}</td>
                    <td className="border px-4 py-2">{c.account_status || (c.state ? "Active" : "Inactive")}</td>
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
    </div>
  );
};

export default Customers;
