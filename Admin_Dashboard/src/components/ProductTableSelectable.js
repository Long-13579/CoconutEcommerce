import React from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";

const ProductTableSelectable = ({ products, selectedIds, onSelect }) => {
  if (!products || products.length === 0) {
    return <div className="text-gray-500 italic">Không có sản phẩm áp dụng</div>;
  }
  return (
    <TableContainer className="mb-8">
      <Table>
        <TableHeader>
          <tr>
            <TableCell></TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p.id)}
                  onChange={() => onSelect(p.id)}
                />
              </TableCell>
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

export default ProductTableSelectable;
