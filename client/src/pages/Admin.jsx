import { useEffect, useState } from "react";
import { fetchAdminStats, generateDiscount } from "../api";

export default function Admin() {
  const [purchasedCount, setpurchasedCount] = useState({});
  const [userId, setUserId] = useState("");
  const [totalPurchasedAmount, settotalPurchasedAmount] = useState(0);
  const [listOfDiscountCodes, setlistOfDiscountCodes] = useState([]);
  const [totalDiscountAmount, settotalDiscountAmount] = useState(0);
  const [discountCode, setdiscountCode] = useState("");
  const loadStats = () => {
    fetchAdminStats("purchasedCount").then((data) => {
      setpurchasedCount(data.data.purchasedCount);
    });
    fetchAdminStats("totalPurchasedAmount").then((data) => {
      settotalPurchasedAmount(data.data.totalPurchasedAmount);
    });
    fetchAdminStats("listOfDiscountCodes").then((data) => {
      setlistOfDiscountCodes(data.data.discountCodes);
    });
    fetchAdminStats("totalDiscountAmount").then((data) => {
      settotalDiscountAmount(data.data.totalDiscountAmount);
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleGenerate = async () => {
    generateDiscount(userId).then((data) => {
      setdiscountCode(data.data.discountCoupon);
      loadStats();
    });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h4>Total Items Sold:</h4>
      {Object.keys(purchasedCount).map((k) => {
        return (
          <>
            <br />
            <span>Name: </span>
            {k}, <span>{purchasedCount[k]}</span>
          </>
        );
      })}
      <h4>Total Purchase Amount: ₹{totalPurchasedAmount}</h4>
      <h4>Total Discount Given: ₹{totalDiscountAmount}</h4>

      <h4>Discount Codes</h4>
      <ul>
        {listOfDiscountCodes.map((d) => (
          <li key={d.code}>{d.code}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="User Id"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          flex: 1,
          marginRight: 10,
        }}
      />
      <button onClick={handleGenerate}>Generate Discount Code</button>
      <h4>Generated Coupe: {discountCode}</h4>
    </div>
  );
}
