import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";


const ProductSelectPopup = ({ open, onClose, onSelect, selectedIds, discountId }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);


  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getProducts()
        .then((data) => setAllProducts(data))
        .catch(() => setAllProducts([]))
        .finally(() => setLoading(false));
      setSelected([]);
    }
  }, [open]);


  if (!open) return null;

  const handleToggle = (productId) => {
    if (selected.includes(productId)) {
      setSelected(selected.filter(id => id !== productId));
    } else {
      setSelected([...selected, productId]);
    }
  };

  const handleSave = () => {
    // Lấy object sản phẩm từ allProducts theo id đã chọn
    const selectedProducts = allProducts.filter(p => selected.includes(p.id));
    onSelect(selectedProducts);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 pr-10 w-full max-w-md relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Select products to add</h2>
            <button
              className="text-2xl text-gray-500 hover:text-gray-700 ml-4"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        {loading ? (
          <div>Loading product list...</div>
        ) : (
          <>
            <ul className="max-h-64 overflow-y-auto mb-4">
              {allProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 border-b">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id) || selected.includes(p.id)}
                      disabled={selectedIds.includes(p.id)}
                      onChange={() => handleToggle(p.id)}
                    />
                    <span>{p.name}</span>
                  </label>
                  {selectedIds.includes(p.id) && (
                    <span className="text-xs text-green-600 font-semibold">Added</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={handleSave}
                disabled={selected.length === 0}
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSelectPopup;
