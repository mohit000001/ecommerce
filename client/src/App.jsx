import { Routes, Route, Link } from "react-router-dom";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <>
      <nav style={{ padding: 10 }}>
        <Link to="/shop">Shop</Link> | <Link to="/aaa">Admin</Link>
      </nav>

      <Routes>
        <Route path="/shop" element={<Shop />} />
        <Route path="/aaa" element={<Admin />} />
      </Routes>
    </>
  );
}
