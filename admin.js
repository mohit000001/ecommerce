import express from "express";
const router = express.Router();
import { generateCoupon } from "./common.js";
router.get("/generatediscount/:userId", (req, res) => {
  const { userId } = req.params || {};
  if (!userId) {
    res.status(500).json({
      error: "userId is missing",
    });
    return;
  }
  let previousOrders = global.orders.filter((o) => o.userId === Number(userId));
  let coupon =
    previousOrders.length && previousOrders.length % 3 === 0
      ? generateCoupon(userId)
      : null;
  res.json({
    data: {
      discountCoupon: coupon,
    },
  });
});

router.get("/stats/:type", (req, res) => {
  const { type } = req.params || {};
  if (!type) {
    res.status(500).json({
      error: "Type is missing",
    });
    return;
  }
  let response = {
    data: {},
    error: null,
  };
  switch (type) {
    case "purchasedCount":
      {
        response.data.purchasedCount = {};
        for (let order of global.orders) {
          for (let product of order.products) {
            let pro = global.productList.find((p) => p.id === product.id);
            if (!response.data.purchasedCount[pro.name]) {
              response.data.purchasedCount[pro.name] = 0;
            }
            response.data.purchasedCount[pro.name] += product.quantity;
          }
        }
      }
      break;
    case "totalPurchasedAmount":
      {
        let amount = 0;
        for (let order of global.orders) {
          for (let product of order.products) {
            let pro = global.productList.find((p) => p.id === product.id);
            amount += product.quantity * pro.price;
          }
        }
        response.data.totalPurchasedAmount = amount;
      }
      break;
    case "listOfDiscountCodes":
      {
        response.data.discountCodes = global.coupons;
      }
      break;
    case "totalDiscountAmount":
      {
        response.data.totalDiscountAmount = global.orders.reduce(
          (total, order) => {
            let coupon = global.coupons.find(
              (c) => c.code === order.discountCoupon,
            );
            let orderAmount = order.products.reduce((total, product) => {
              let pro = global.productList.find((p) => p.id === product.id);
              return (total += product.quantity * pro.price);
            }, 0);
            return (total +=
              (coupon && orderAmount && (orderAmount * coupon.per) / 100) || 0);
          },
          0,
        );
      }
      break;
    default: {
      res.status(500).json({
        error: "Unknow Type",
      });
      return;
    }
  }
  res.status(200).json(response);
});

export default router;
