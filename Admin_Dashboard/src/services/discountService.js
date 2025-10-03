const API_BASE = "http://localhost:8000/api/discount/";

export const getDiscounts = async () => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch discounts");
  return await res.json();
};

export const getDiscountDetail = async (id) => {
  const res = await fetch(`${API_BASE}${id}/`);
  if (!res.ok) throw new Error("Failed to fetch discount detail");
  return await res.json();
};

export const createDiscount = async (data) => {
  const res = await fetch(`${API_BASE}create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create discount");
  return await res.json();
};

export const updateDiscount = async (id, data) => {
  const res = await fetch(`${API_BASE}${id}/update/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update discount");
  return await res.json();
};

export const updateDiscountProducts = async (id, product_ids) => {
  const res = await fetch(`${API_BASE}${id}/update-products/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_ids }),
  });
  if (!res.ok) throw new Error("Failed to update discount products");
  return await res.json();
};

export const partialUpdateDiscount = async (id, data) => {
  const res = await fetch(`${API_BASE}${id}/partial-update/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to partial update discount");
  return await res.json();
};

export const deleteDiscount = async (id) => {
  const res = await fetch(`${API_BASE}${id}/delete/`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete discount");
  // Nếu BE trả về 204 No Content thì không có body
  try {
    return await res.json();
  } catch {
    return null;
  }
};
