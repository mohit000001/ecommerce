import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
const productRoutes = (await import("../products.js")).default;
const adminRoutes = (await import("../admin.js")).default;

// Mock global data
global.productList = [
  { id: 1, name: "Phone", price: 10000 },
  { id: 2, name: "Laptop", price: 50000 },
];
global.orders = [];
global.carts = {};
global.coupons = [{ code: "DISCOUNT50", per: 50, used: false }];

// Mock generateCoupon
// ✅ ESM-safe mock
await jest.unstable_mockModule("../common.js", () => ({
  generateCoupon: jest.fn(() => "COUPON123"),
}));

// ✅ Import AFTER mocking

// Create express app for testing
const app = express();
app.use(express.json());
app.use("/product", productRoutes);
app.use("/admin", adminRoutes);
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

describe("Express Routes", () => {
  beforeEach(() => {
    global.orders = [];
    global.carts = {};
    global.coupons.forEach((c) => (c.used = false));
  });

  /* ---------- Health ---------- */
  test("GET /health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
  });

  /* ---------- Products ---------- */
  test("GET /product/productslist", async () => {
    const res = await request(app).get("/product/productslist");
    expect(res.status).toBe(200);
    expect(res.body.data.products.length).toBe(2);
  });

  test("POST /product/addtocart", async () => {
    const res = await request(app)
      .post("/product/addtocart")
      .send({ id: 1, quantity: 2, userId: 1 });
    expect(res.status).toBe(200);
    expect(res.body.data).toBe("Product Added Successfully");
    expect(global.carts[1].length).toBe(1);
  });

  test("POST /product/checkout empty cart", async () => {
    const res = await request(app)
      .post("/product/checkout")
      .send({ userId: 1 });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Cart is empty");
  });

  test("POST /product/checkout with coupon", async () => {
    global.carts[1] = [{ id: 1, quantity: 1 }];
    const res = await request(app)
      .post("/product/checkout")
      .send({ userId: 1, couponCode: "DISCOUNT50" });
    expect(res.status).toBe(200);
    expect(res.body.data.orderId).toBeDefined();
    expect(global.coupons[0].used).toBe(true);
  });

  test("POST /product/checkout with invalid coupon", async () => {
    global.carts[1] = [{ id: 1, quantity: 1 }];
    const res = await request(app)
      .post("/product/checkout")
      .send({ userId: 1, couponCode: "INVALID" });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("This Coupon is invalid");
  });

  test("POST /product/checkout with already used coupon", async () => {
    global.coupons[0].used = true;
    global.carts[1] = [{ id: 1, quantity: 1 }];
    const res = await request(app)
      .post("/product/checkout")
      .send({ userId: 1, couponCode: "DISCOUNT50" });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("This Coupon is already used");
  });

  /* ---------- Admin ---------- */
  test("GET /admin/generatediscount/:userId", async () => {
    const res = await request(app).get("/admin/generatediscount/1");
    expect(res.status).toBe(200);
    expect(res.body.data.discountCoupon).toBeNull(); // no previous orders
  });

  test("GET /admin/generatediscount/:userId missing", async () => {
    const res = await request(app).get("/admin/generatediscount/");
    expect(res.status).toBe(404); // route missing
  });

  test("GET /admin/stats/:type purchasedCount", async () => {
    // Add an order
    global.orders.push({
      userId: 1,
      products: [{ id: 1, quantity: 2 }],
      status: "open",
    });
    const res = await request(app).get("/admin/stats/purchasedCount");
    expect(res.status).toBe(200);
    expect(res.body.data.purchasedCount.Phone).toBe(2);
  });

  test("GET /admin/stats/:type unknown", async () => {
    const res = await request(app).get("/admin/stats/unknownType");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Unknow Type");
  });
});
