A minimal Express.js backend providing product listing, cart, checkout,
and admin statistics using in-memory storage.

# Data is stored in memory and resets on server restart.

# Build and Run Server

# Client

- go to /client
- npm install
- npm run build

# Backend

- add env file and configurations (port etc)
- npm install
- node --env-file=yourenv.env app.js

Server runs on:
http://localhost:8000

---

## Routes

### Health Check

GET /health

---

# Get Products

GET /product/productslist

Returns list of available products.

---

# Add to Cart

POST /product/addtocart

Body:
{
"id": 1,
"quantity": 2
}

Behavior:

- Creates cart if not exists
- Adds product to user's cart

---

### Checkout

POST /product/checkout

Body:
{
"couponCode": "DISCOUNT50"
}

Behavior:

- Fails if cart is empty
- Validates coupon (invalid / used)
- Creates order
- Clears cart after checkout
- Generates new discount coupon on eligible orders

---

## 🧑‍💼 Admin Routes

### Generate Discount Coupon

GET /admin/generatediscount/:userId

---

### Admin Stats

GET /admin/stats/purchasedCount
GET /admin/stats/totalPurchasedAmount
GET /admin/stats/listOfDiscountCodes
GET /admin/stats/totalDiscountAmount

### All other routes

Will be redirected to client build

---

## Notes

- Uses in-memory storage (global variables)
- No authentication
