const generateCoupon = (userId) => {
  let coupon = {
    code: Math.floor(10000 + Math.random() * 90000),
    per: 10,
    usedBy: null,
    used: false,
  };
  global.coupons.push(coupon);
  return coupon.code;
};
export { generateCoupon };
