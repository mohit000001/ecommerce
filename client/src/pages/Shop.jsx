import { useEffect, useState } from "react";
import { fetchProducts, addToCart, checkout } from "../api";
import Toast from "../Toast";
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState({});
  const [discountCode, setDiscountCode] = useState("");
  const [toast, setToast] = useState(null);
  useEffect(() => {
    fetchProducts().then((data) => {
      if (data.data) {
        setProducts(data.data.products);
      }
    });
  }, []);

  const inc = (id) => setQty((q) => ({ ...q, [id]: (q[id] || 1) + 1 }));

  const dec = (id) =>
    setQty((q) => ({ ...q, [id]: Math.max(1, (q[id] || 1) - 1) }));

  const handleAdd = async (id) => {
    await addToCart({ id, quantity: qty[id] || 1 });
    setToast({ msg: "Item added to cart", type: "success" });
  };

  const handleCheckout = async () => {
    try {
      let res = await checkout(discountCode ? Number(discountCode) : undefined);
      res = await res.json();
      if (res.error) {
        setToast({ msg: "Error:" + res.error, type: "error" });
      } else {
        setToast({
          msg: `Checkout successful.${
            res.data?.discountCoupon
              ? "you got discount code " + res.data.discountCoupon
              : ""
          }`,
          type: "success",
          autoClose: res.data?.discountCoupon ? false : true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
          autoClose={toast.autoClose}
        />
      )}
      <h2>🛒 Shop</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Apply discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            flex: 1,
            marginRight: 10,
          }}
        />
        <button className="secondary" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {products.map((p) => (
          <div key={p.id} className="card">
            <h4>{p.name}</h4>
            <p className="price">₹{p.price}</p>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => dec(p.id)}>-</button>
              <strong>{qty[p.id] || 1}</strong>
              <button onClick={() => inc(p.id)}>+</button>
            </div>

            <button style={{ marginTop: 10 }} onClick={() => handleAdd(p.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
