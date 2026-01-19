import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./admin.js";
import productRoutes from "./products.js";
const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middlewares ---------- */
app.use(cors()); // Enable CORS
app.use(express.json()); // JSON body handling

app.use("/product", productRoutes);
app.use("/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", env: process.env.NODE_ENV });
});
/* ---------- Start Server ---------- */
import productList from "./productList.js";
global.productList = productList;
global.orders = [];
global.carts = {};
global.coupons = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/", express.static("client/dist"));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

app.listen(Number(PORT), () => {
  console.log(`Server running on port ${PORT}`);
});

/* ---------- Process-level Error Handling ---------- */
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥");
  console.error(err.name, err.message);
  console.error(err.stack);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION 💥");
  console.error("Reason:", reason);
});
/********************* */
/********************* */
