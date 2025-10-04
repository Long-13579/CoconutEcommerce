const API_BASE = "http://localhost:8000/api/products/";

export const getProducts = async () => {
  const res = await fetch(`${API_BASE}list`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
};

export const getProductDetail = async (id) => {
  const res = await fetch(`${API_BASE}${id}/`);
  if (!res.ok) throw new Error("Failed to fetch product detail");
  return await res.json();
};

export const updateProduct = async (slug, data) => {
  const res = await fetch(`${API_BASE}${slug}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return await res.json();
};

// Add more product-related API functions as needed
