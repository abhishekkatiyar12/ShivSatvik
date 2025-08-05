import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FlatDetails from "./pages/FlatDetails";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ marginTop: '80px', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flat/:id" element={<FlatDetails />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
