import express from "express";
import { generateCoupon } from "./common.js";
const router = express.Router();
router.get("/productslist", (req, res) => {
  res.json({
    data: {
      products: global.productList,
    },
    error: null,
  });
});
router.post("/addtocart", (req, res) => {
  let body = req.body || {};
  let { id, quantity, userId = 1 } = body;
  if (!global.carts[userId]) {
    global.carts[userId] = [];
  }
  carts[userId].push({ id, quantity });
  res.json({
    data: "Product Added Successfully",
    error: null,
  });
});

router.post("/checkout", (req, res) => {
  let body = req.body || {};
  let { userId = 1, couponCode } = body;
  if (!global.carts[userId]?.length) {
    res.status(500).json({
      error: "Cart is empty",
    });
    return;
  }
  /************ Discount Coupon Logic */
  if (couponCode) {
    let coupon = global.coupons.find((c) => c.code === couponCode);
    if (coupon) {
      if (coupon.used) {
        res.status(500).json({
          error: "This Coupon is already used",
        });
        return;
      } else {
        coupon.used = true;
        coupon.usedBy = userId;
      }
    } else {
      res.status(500).json({
        error: "This Coupon is invalid",
      });
      return;
    }
  }
  /***************************/
  let previousOrders = global.orders.filter((o) => o.userId === userId);
  let coupon =
    previousOrders.length && previousOrders.length % 2 === 0
      ? generateCoupon(userId)
      : null;
  let orderId = Math.floor(10000 + Math.random() * 90000);
  global.orders.push({
    orderId,
    userId,
    products: [...global.carts[userId]],
    generateDate: Date.now(),
    discountCoupon: couponCode,
    status: "open",
  });
  global.carts[userId] = [];
  res.json({
    data: {
      discountCoupon: coupon,
      orderId,
    },
    error: null,
  });
});

export default router;
