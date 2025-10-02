import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Pagination,
} from "@windmill/react-ui";
import { getDiscounts } from "../services/discountService";

const resultsPerPage = 10;


// Format ISO date string to dd/MM/yyyy
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

const DiscountsTable = () => {
  const [page, setPage] = useState(1);
  const [discounts, setDiscounts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      try {
        const data = await getDiscounts();
        setTotalResults(data.length);
        setDiscounts(data.slice((page - 1) * resultsPerPage, page * resultsPerPage));
      } catch (err) {
        setError("Error loading discount list");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, [page]);

  function onPageChange(p) {
    setPage(p);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <TableContainer className="mb-8">
      <Table>
        <TableHeader>
          <tr>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Percentage reduction</TableCell>
            <TableCell>Applicable products</TableCell>
            <TableCell>Start date</TableCell>
            <TableCell>End date</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {discounts.map((discount) => (
            <TableRow key={discount.id}>
              <TableCell>
                <Link to={`/discounts/${discount.id}`} className="text-blue-600 hover:underline">
                  {discount.id}
                </Link>
              </TableCell>
              <TableCell>
                <Link to={`/discounts/${discount.id}`} className="text-blue-600 hover:underline">
                  {discount.name}
                </Link>
              </TableCell>
              <TableCell>{discount.discount_percent}%</TableCell>
              <TableCell>
                {discount.products && discount.products.length > 0
                  ? discount.products.length + " products"
                  : "0"}
              </TableCell>
              <TableCell>{formatDate(discount.start_date)}</TableCell>
              <TableCell>{formatDate(discount.end_date)}</TableCell>
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
  );
};

export default DiscountsTable;
