import React, { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DebugKits from "./pages/DebugKits";
import CartDrawer from "./components/CartDrawer";

function AppContent() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setPage("home");
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>⚽</div>
          <h2>Loading Football Store...</h2>
        </div>
      </div>
    );
  }

  // Show auth pages if not logged in
  if (page === "login") {
    return <Login onLogin={handleLogin} goToRegister={() => setPage("register")} />;
  }

  if (page === "register") {
    return <Register onRegister={handleLogin} goToLogin={() => setPage("login")} />;
  }

  return (
    <>
      <Navbar 
        onCartClick={() => setOpen(true)} 
        onHomeClick={() => setPage("home")}
        onCheckoutClick={() => setPage("checkout")}
        onLoginClick={() => setPage("login")}
        onLogoutClick={handleLogout}
        user={user}
      />

      {page === "home" && <Home />}
      {page === "checkout" && <Checkout goHome={() => setPage("home")} user={user} />}
      {page === "debug" && <DebugKits />}
      <CartDrawer 
        open={open} 
        close={() => setOpen(false)} 
        toCheckout={() => {
          setOpen(false);
          setPage("checkout");
        }}
      />

      <button 
        className="floating-cart"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          background: "linear-gradient(45deg, #ff4d4d, #ff9966)",
          color: "white",
          border: "none",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          fontSize: "28px",
          cursor: "pointer",
          boxShadow: "0 8px 25px rgba(255, 77, 77, 0.4)",
          zIndex: 999,
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        🛒
      </button>
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <AppContent />
      </div>
    </CartProvider>
  );
}