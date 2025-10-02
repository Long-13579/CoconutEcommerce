import React from "react";
import { Link } from "react-router-dom";
import DiscountsTable from "../components/DiscountsTable";
import PageTitle from "../components/Typography/PageTitle";

const DiscountsPage = () => {
  return (
    <div className="p-4">
      <PageTitle>Discount List</PageTitle>
      <div className="flex justify-end mb-4">
        <Link
          to="/discounts/create"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
        >
          Add Discount
        </Link>
      </div>
      <DiscountsTable />
    </div>
  );
};

export default DiscountsPage;
