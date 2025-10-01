import React from "react";
import DiscountsTable from "../components/DiscountsTable";
import PageTitle from "../components/Typography/PageTitle";

const DiscountsPage = () => {
  return (
    <div className="p-4">
      <PageTitle>Discount List</PageTitle>
      <DiscountsTable />
    </div>
  );
};

export default DiscountsPage;
