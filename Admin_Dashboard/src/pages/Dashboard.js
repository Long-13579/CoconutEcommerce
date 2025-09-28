import React, { useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import InfoCard from "../components/Cards/InfoCard";
import RoundIcon from "../components/RoundIcon";
import { PeopleIcon, MoneyIcon, CartIcon, ChatIcon } from "../icons";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from "../utils/demo/chartsData";
import OrdersTable from "../components/OrdersTable";

function Dashboard() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/users/list/")
      .then(res => res.json())
      .then(users => {
        if (Array.isArray(users)) {
          setTotalCustomers(users.length);
        } else {
          setTotalCustomers(0);
        }
      })
      .catch(() => setTotalCustomers(0));
    fetch("http://localhost:8000/api/carts/list/")
      .then(res => res.json())
      .then(orders => {
        if (Array.isArray(orders)) {
          setNewOrders(orders.length);
          setTotalIncome(orders.reduce((sum, o) => sum + (o.cart_total || 0), 0));
        } else {
          setNewOrders(0);
          setTotalIncome(0);
        }
      })
      .catch(() => {
        setNewOrders(0);
        setTotalIncome(0);
      });
  }, []);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total customers" value={totalCustomers}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>
        <InfoCard title="Total income" value={`$${totalIncome.toFixed(2)}`}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>
        <InfoCard title="New Orders" value={newOrders}>
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>
        <InfoCard title="Unread Chats" value="15">
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      {/* <!-- Charts --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Revenue">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>
        <ChartCard title="Traffic">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>
      </div>

      {/* <!-- Recent Orders --> */}
      <PageTitle>Orders</PageTitle>
      <OrdersTable resultsPerPage={10} />
      {/* Role Management UI đã bị xoá khỏi dashboard theo yêu cầu */}
    </>
  );
}

export default Dashboard;
