import React, { useState, useEffect } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from "@windmill/react-ui";
// import response from "../utils/demo/ordersData";

const OrdersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  // pagination setup
  const [totalResults, setTotalResults] = useState(0);

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    fetch("http://localhost:8000/carts/list/")
      .then(res => res.json())
      .then(orders => {
        if (!Array.isArray(orders)) {
          setTotalResults(0);
          setData([]);
          return;
        }
        setTotalResults(orders.length);
        let filtered = orders;
        if (filter === "paid") filtered = orders.filter(o => o.status === "Paid");
        if (filter === "un-paid") filtered = orders.filter(o => o.status === "Un-paid");
        if (filter === "completed") filtered = orders.filter(o => o.status === "Completed");
        setData(filtered.slice((page - 1) * resultsPerPage, page * resultsPerPage));
      })
      .catch(() => {
        setTotalResults(0);
        setData([]);
      });
  }, [page, resultsPerPage, filter]);

  return (
    <div>
      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={user.avatar}
                      alt="User image"
                    />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">#000{i}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">$ {user.amount}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    type={
                      user.status === "Un-paid"
                        ? "danger"
                        : user.status === "Paid"
                          ? "success"
                          : user.status === "Completed"
                            ? "warning"
                            : "neutral"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(user.date).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default OrdersTable;
