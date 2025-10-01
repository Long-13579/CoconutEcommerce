const API_BASE = "http://localhost:8000/products/";

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

// Add more product-related API functions as needed
