import React from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";

const ProductTable = ({ products }) => {
  if (!products || products.length === 0) {
    return <div className="text-gray-500 italic">Không có sản phẩm áp dụng</div>;
  }
  return (
    <TableContainer className="mb-8">
      <Table>
        <TableHeader>
          <tr>
            <TableCell>ID</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category_name}</TableCell>
              <TableCell>{p.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
