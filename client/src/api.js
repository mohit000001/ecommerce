const API = "";

export const fetchProducts = () =>
  fetch(`${API}/product/productslist`).then((r) => r.json());

export const addToCart = (product) =>
  fetch(`${API}/product/addtocart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...product }),
  });

export const checkout = (couponCode) =>
  fetch(`${API}/product/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ couponCode }),
  });

export const fetchAdminStats = (type) =>
  fetch(`${API}/admin/stats/${type}`).then((r) => r.json());

export const generateDiscount = (userId) =>
  fetch(`${API}/admin/generatediscount/${userId}`).then((r) => r.json());
