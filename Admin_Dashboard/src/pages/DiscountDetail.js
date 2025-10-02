import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDiscountDetail, updateDiscount, deleteDiscount } from "../services/discountService";
import ProductTable from "../components/ProductTable";
import ProductTableSelectable from "../components/ProductTableSelectable";
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
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
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
        setDiscount({
          ...data,
          _originalProducts: data.products // luôn lưu bản gốc khi load
        });
        setForm({
          name: data.name || "",
          discount_percent: data.discount_percent || "",
          start_date: data.start_date ? data.start_date.slice(0, 10) : "",
          end_date: data.end_date ? data.end_date.slice(0, 10) : "",
          product_ids: data.products ? data.products.map(p => p.id) : [],
        });
      } catch (err) {
        setError("Unable to load discount information");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!discount) return <div>No discount found</div>;

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
      product_ids: (discount._originalProducts || []).map(p => p.id),
    });
    setDiscount(prev =>
      prev._originalProducts
        ? { ...prev, products: prev._originalProducts }
        : prev
    );
    setSelectedToDelete([]);
  };

  const handleSave = async () => {
    // Validate ngày
    const { start_date, end_date } = form;
    if (!start_date || !end_date) {
      alert("Please enter full start and end dates.");
      return;
    }
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (start >= end) {
      alert("The start date must be less than the end date and cannot be the same date.");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateDiscount(discount.id, form);
      setDiscount(updated);
      setEditMode(false);
    } catch (err) {
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <PageTitle>Discount Detail</PageTitle>
      <div className="mb-4 flex items-center gap-4">
        <Link to="/discounts" className="text-blue-600 hover:underline">← Back to list</Link>
        {!editMode && (
          <>
            <button
              onClick={handleEdit}
              className="ml-auto px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeletePopup(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
            >
              Delete
            </button>
          </>
        )}
      </div>
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Deleting Discount</h2>
            <p className="mb-6">Are you sure you want to delete this discount?</p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={async () => {
                  try {
                    await deleteDiscount(discount.id);
                    window.location.href = "/discounts";
                  } catch {
                    alert("Delete failed");
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow rounded p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Name</label>
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
            <label className="block text-gray-600 font-semibold mb-1">Percentage reduction</label>
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
            <label className="block text-gray-600 font-semibold mb-1">Start date</label>
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
            <label className="block text-gray-600 font-semibold mb-1">End date</label>
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
            <label className="block text-gray-600 font-semibold">Applicable products</label>
            {editMode && (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  onClick={openProductPopup}
                >
                  Add Products
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  disabled={selectedToDelete.length === 0}
                  onClick={() => {
                    // Xóa các sản phẩm đã chọn
                    const newIds = form.product_ids.filter(id => !selectedToDelete.includes(id));
                    setForm({ ...form, product_ids: newIds });
                    setDiscount(prev => ({
                      ...prev,
                      products: newIds.map(id => {
                        const allProducts = prev.products || [];
                        return allProducts.find(p => p.id === id);
                      }).filter(Boolean)
                    }));
                    setSelectedToDelete([]);
                  }}
                >
                  Delete Products
                </button>
              </div>
            )}
          </div>
          {editMode ? (
            <ProductTableSelectable
              products={(() => {
                const allProducts = discount.products || [];
                const productMap = new Map();
                allProducts.forEach(p => productMap.set(p.id, p));
                (form.product_ids || []).forEach(id => {
                  if (!productMap.has(id)) {
                    productMap.set(id, { id, name: "(Recently selected)", price: "", ...{} });
                  }
                });
                return (form.product_ids || []).map(id => productMap.get(id)).filter(Boolean);
              })()}
              selectedIds={selectedToDelete}
              onSelect={id => {
                setSelectedToDelete(prev =>
                  prev.includes(id)
                    ? prev.filter(i => i !== id)
                    : [...prev, id]
                );
              }}
            />
          ) : (
            <ProductTable
              products={(() => {
                const allProducts = discount.products || [];
                const productMap = new Map();
                allProducts.forEach(p => productMap.set(p.id, p));
                (form.product_ids || []).forEach(id => {
                  if (!productMap.has(id)) {
                    productMap.set(id, { id, name: "(Recently selected)", price: "", ...{} });
                  }
                });
                return (form.product_ids || []).map(id => productMap.get(id)).filter(Boolean);
              })()}
            />
          )}
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
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded shadow"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountDetail;
