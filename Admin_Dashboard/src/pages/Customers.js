import React, { useState } from "react";
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
              <tr>
                <td className="text-center py-6" colSpan={7}>No data</td>
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
      )}
    </div>
  );
};

export default Customers;
