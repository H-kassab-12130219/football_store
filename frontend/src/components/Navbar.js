import React from "react";
import { useCart } from "../context/CartContext";

export default function Navbar({ 
  onCartClick, 
  onHomeClick, 
  onCheckoutClick, 
  onLoginClick, 
  onLogoutClick,
  user 
}) {
  const { cart } = useCart();
  const cartCount = cart.length;

  return (
    <nav style={{
      background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)",
      color: "white",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Logo/Title */}
      <div 
        onClick={onHomeClick}
        style={{ 
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <div style={{
          fontSize: "30px",
          background: "linear-gradient(45deg, #ff4d4d, #ff9966)",
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          ⚽
        </div>
        <h1 style={{ 
          margin: 0, 
          fontSize: "24px",
          background: "linear-gradient(45deg, #ff4d4d, #ff9966)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Football Kits Store
        </h1>
      </div>
      
      {/* User Info */}
      {user && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "rgba(255,255,255,0.1)",
          padding: "8px 15px",
          borderRadius: "20px"
        }}>
          <span style={{ fontSize: "20px" }}>👤</span>
          <span>{user.username || user.email}</span>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <button 
          onClick={onHomeClick}
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "10px 20px",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
          onMouseOver={e => e.target.style.background = "rgba(255,255,255,0.2)"}
          onMouseOut={e => e.target.style.background = "rgba(255,255,255,0.1)"}
        >
          🏠 Home
        </button>
        
        {user ? (
          <>
            <button 
              onClick={onCheckoutClick}
              style={{
                background: "linear-gradient(45deg, #28a745, #20c997)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={e => e.target.style.transform = "translateY(0)"}
            >
              💳 Checkout {cartCount > 0 && `(${cartCount})`}
            </button>
            
            <button 
              onClick={onLogoutClick}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "10px 20px",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseOver={e => e.target.style.background = "rgba(255,77,77,0.2)"}
              onMouseOut={e => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <button 
            onClick={onLoginClick}
            style={{
              background: "linear-gradient(45deg, #007bff, #0056b3)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.target.style.transform = "translateY(0)"}
          >
            🔐 Login
          </button>
        )}
        
        <button 
          onClick={onCartClick}
          style={{
            background: "linear-gradient(45deg, #ff4d4d, #ff9966)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            position: "relative"
          }}
          onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
          onMouseOut={e => e.target.style.transform = "translateY(0)"}
        >
          🛒 Cart
          {cartCount > 0 && (
            <span style={{
              background: "white",
              color: "#ff4d4d",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "5px",
              fontWeight: "bold"
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}