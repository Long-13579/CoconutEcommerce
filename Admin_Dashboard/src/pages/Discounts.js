import React, { useEffect, useState } from "react";
import { getDiscounts } from "../services/discountService";

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const data = await getDiscounts();
        setDiscounts(data);
      } catch (err) {
        setError("Lỗi khi tải danh sách discount");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách Discount</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên</th>
            <th className="border px-4 py-2">Phần trăm giảm</th>
            <th className="border px-4 py-2">Sản phẩm áp dụng</th>
            <th className="border px-4 py-2">Ngày bắt đầu</th>
            <th className="border px-4 py-2">Ngày kết thúc</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount.id}>
              <td className="border px-4 py-2">{discount.id}</td>
              <td className="border px-4 py-2">{discount.name}</td>
              <td className="border px-4 py-2">{discount.discount_percent}%</td>
              <td className="border px-4 py-2">
                {discount.products && discount.products.length > 0
                  ? discount.products.map((p) => p.name).join(", ")
                  : "-"}
              </td>
              <td className="border px-4 py-2">{discount.start_date}</td>
              <td className="border px-4 py-2">{discount.end_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiscountsPage;
