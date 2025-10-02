import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { createDiscount } from "../services/discountService";
import ProductTableSelectable from "../components/ProductTableSelectable";
import ProductSelectPopup from "../components/ProductSelectPopup";
import PageTitle from "../components/Typography/PageTitle";

const AddDiscount = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    name: "",
    discount_percent: "",
    start_date: "",
    end_date: "",
    product_ids: [],
  });
  const [saving, setSaving] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const openProductPopup = () => setShowProductPopup(true);
  const closeProductPopup = () => setShowProductPopup(false);
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  const [products, setProducts] = useState([]);

  const handleAddProduct = (newProducts) => {
    const idsToAdd = newProducts.map(p => p.id);
    const mergedIds = Array.from(new Set([...(form.product_ids || []), ...idsToAdd]));
    const productMap = new Map();
    products.forEach(p => productMap.set(p.id, p));
    newProducts.forEach(p => productMap.set(p.id, p));
    const mergedProducts = mergedIds.map(id => productMap.get(id)).filter(Boolean);
    setForm({ ...form, product_ids: mergedIds });
    setProducts(mergedProducts);
    setShowProductPopup(false);
  };

  const handleDeleteProducts = () => {
    const newIds = form.product_ids.filter(id => !selectedToDelete.includes(id));
    setForm({ ...form, product_ids: newIds });
    setProducts(products.filter(p => newIds.includes(p.id)));
    setSelectedToDelete([]);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { name, discount_percent, start_date, end_date } = form;
    // Validate tên
    if (!name || name.trim().length < 3) {
      alert("Discount name must be at least 3 characters.");
      return;
    }
    // Validate phần trăm
    const percent = Number(discount_percent);
    if (isNaN(percent) || percent < 1 || percent > 100) {
      alert("The percentage discount must be a number from 1 to 100.");
      return;
    }
    // Validate ngày bắt đầu
    if (!start_date) {
      alert("Please select a start date.");
      return;
    }
    // Validate ngày kết thúc
    if (!end_date) {
      alert("Please select an end date.");
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
      await createDiscount(form);
      history.push("/discounts");
    } catch {
      alert("Create discount failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <PageTitle>Add Discount</PageTitle>
      <Link to="/discounts" className="text-blue-600 hover:underline">← Back to list</Link>
      <div className="bg-white shadow rounded p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Percentage reduction</label>
            <input
              type="number"
              name="discount_percent"
              value={form.discount_percent}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              min={0}
              max={100}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Start date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">End date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-600 font-semibold">Applicable products</label>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                onClick={openProductPopup}
              >
                Add products
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                disabled={selectedToDelete.length === 0}
                onClick={handleDeleteProducts}
              >
                Delete products
              </button>
            </div>
          </div>
          <ProductTableSelectable
            products={products}
            selectedIds={selectedToDelete}
            onSelect={id => {
              setSelectedToDelete(prev =>
                prev.includes(id)
                  ? prev.filter(i => i !== id)
                  : [...prev, id]
              );
            }}
          />
        </div>
        <ProductSelectPopup
          open={showProductPopup}
          onClose={closeProductPopup}
          onSelect={handleAddProduct}
          selectedIds={form.product_ids}
        />
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => history.push("/discounts")}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded shadow"
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDiscount;
