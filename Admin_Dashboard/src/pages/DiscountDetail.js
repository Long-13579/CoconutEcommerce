import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDiscountDetail, updateDiscount } from "../services/discountService";
import ProductTable from "../components/ProductTable";
import ProductSelectPopup from "../components/ProductSelectPopup";
import PageTitle from "../components/Typography/PageTitle";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

const DiscountDetail = () => {
  const { id } = useParams();
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", discount_percent: "", start_date: "", end_date: "" });
  const [saving, setSaving] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const openProductPopup = () => setShowProductPopup(true);
  const closeProductPopup = () => setShowProductPopup(false);
  // Nhận mảng object sản phẩm, thêm vào bảng và cập nhật product_ids
  const handleAddProduct = (products) => {
    const idsToAdd = products.map(p => p.id);
    const mergedIds = Array.from(new Set([...(form.product_ids || []), ...idsToAdd]));
    const oldProducts = discount.products || [];
    const productMap = new Map();
    oldProducts.forEach(p => productMap.set(p.id, p));
    products.forEach(p => productMap.set(p.id, p));
    const mergedProducts = mergedIds.map(id => productMap.get(id)).filter(Boolean);
    setForm({ ...form, product_ids: mergedIds });
    setDiscount(prev => ({
      ...prev,
      products: mergedProducts,
      _originalProducts: prev._originalProducts || oldProducts // chỉ lưu 1 lần bản gốc
    }));
    setShowProductPopup(false);
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getDiscountDetail(id);
        setDiscount(data);
        setForm({
          name: data.name || "",
          discount_percent: data.discount_percent || "",
          start_date: data.start_date ? data.start_date.slice(0, 10) : "",
          end_date: data.end_date ? data.end_date.slice(0, 10) : "",
          product_ids: data.products ? data.products.map(p => p.id) : [],
        });
      } catch (err) {
        setError("Không thể tải thông tin discount");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);


  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!discount) return <div>Không tìm thấy discount</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: discount.name || "",
      discount_percent: discount.discount_percent || "",
      start_date: discount.start_date ? discount.start_date.slice(0, 10) : "",
      end_date: discount.end_date ? discount.end_date.slice(0, 10) : "",
      product_ids: (discount._originalProducts || discount.products || []).map(p => p.id),
    });
    setDiscount(prev =>
      prev._originalProducts
        ? { ...prev, products: prev._originalProducts }
        : prev
    );
  };

  const handleSave = async () => {
    // Validate ngày
    const { start_date, end_date } = form;
    if (!start_date || !end_date) {
      alert("Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc.");
      return;
    }
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (start >= end) {
      alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc và không được trùng ngày.");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateDiscount(discount.id, form);
      setDiscount(updated);
      setEditMode(false);
    } catch (err) {
      alert("Lỗi khi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <PageTitle>Discount Detail</PageTitle>
      <div className="mb-4 flex items-center gap-4">
        <Link to="/discounts" className="text-blue-600 hover:underline">← Quay lại danh sách</Link>
        {!editMode && (
          <button
            onClick={handleEdit}
            className="ml-auto px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow"
          >
            Chỉnh sửa
          </button>
        )}
      </div>
      <div className="bg-white shadow rounded p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Tên</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            ) : (
              <div className="border rounded px-3 py-2 bg-gray-50">{discount.name}</div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Phần trăm giảm</label>
            {editMode ? (
              <input
                type="number"
                name="discount_percent"
                value={form.discount_percent}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
                min={0}
                max={100}
              />
            ) : (
              <div className="border rounded px-3 py-2 bg-gray-50">{discount.discount_percent}%</div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Ngày bắt đầu</label>
            {editMode ? (
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            ) : (
              <div className="border rounded px-3 py-2 bg-gray-50">{formatDate(discount.start_date)}</div>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Ngày kết thúc</label>
            {editMode ? (
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              />
            ) : (
              <div className="border rounded px-3 py-2 bg-gray-50">{formatDate(discount.end_date)}</div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-600 font-semibold">Sản phẩm áp dụng</label>
            {editMode && (
              <button
                type="button"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                onClick={openProductPopup}
              >
                Thêm sản phẩm
              </button>
            )}
          </div>
          <ProductTable
            products={(() => {
              // Lấy danh sách sản phẩm từ discount.products và bổ sung các id mới nếu có
              const allProducts = discount.products || [];
              // Tạo map để tránh trùng id
              const productMap = new Map();
              allProducts.forEach(p => productMap.set(p.id, p));
              // Nếu có id mới mà chưa có object, tạo object tạm với id và tên rỗng
              (form.product_ids || []).forEach(id => {
                if (!productMap.has(id)) {
                  productMap.set(id, { id, name: "(Mới chọn)", price: "", ...{} });
                }
              });
              // Trả về danh sách theo thứ tự form.product_ids
              return (form.product_ids || []).map(id => productMap.get(id)).filter(Boolean);
            })()}
          />
        </div>

        <ProductSelectPopup
          open={showProductPopup}
          onClose={closeProductPopup}
          onSelect={handleAddProduct}
          selectedIds={form.product_ids}
          discountId={discount.id}
        />
        {editMode && (
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded shadow"
              disabled={saving}
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountDetail;
