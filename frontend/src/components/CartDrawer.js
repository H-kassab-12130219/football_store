import React from "react";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, close, toCheckout }) {
  const { cart, removeItem, getTotal } = useCart();
  
  // Calculate total directly to debug
  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      return sum + price;
    }, 0);
  };
  
  const total = getTotal();
  const debugTotal = calculateTotal(); // For debugging
  const itemCount = cart.length;

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={close}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 999
        }}
      />
      
      {/* Drawer */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "450px",
        height: "100vh",
        background: "white",
        boxShadow: "-10px 0 40px rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ 
          padding: "25px 30px",
          background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>🛒 Your Cart</h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.8, fontSize: "14px" }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button 
            onClick={close}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              fontSize: "20px",
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Cart Items */}
        <div style={{ 
          flex: 1,
          overflowY: "auto",
          padding: "20px"
        }}>
          {cart.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#666"
            }}>
              <div style={{ fontSize: "60px", marginBottom: "20px", opacity: 0.5 }}>🛒</div>
              <h3 style={{ color: "#333", marginBottom: "10px" }}>Your cart is empty</h3>
              <p style={{ marginBottom: "30px" }}>Add some football kits to get started!</p>
              <button 
                onClick={close}
                style={{
                  background: "linear-gradient(45deg, #007bff, #0056b3)",
                  color: "white",
                  border: "none",
                  padding: "12px 30px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Browse Kits
              </button>
            </div>
          ) : (
            <>
              {/* Debug info - remove this after fixing */}
              <div style={{ 
                background: "#e7f3ff", 
                padding: "10px", 
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "12px",
                color: "#0066cc"
              }}>
                <strong>Debug Info:</strong> Cart has {cart.length} items. 
                getTotal(): ${total}, calculateTotal(): ${debugTotal.toFixed(2)}
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {cart.map((item, index) => (
                  <div key={item.cartId || index} style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    gap: "15px",
                    border: "1px solid #e9ecef"
                  }}>
                    {/* Color Circle or Image */}
                    <div style={{
                      width: "70px",
                      height: "70px",
                      background: item.gradient || item.img ? "transparent" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      color: "white",
                      flexShrink: 0,
                      overflow: "hidden"
                    }}>
                      {item.img ? (
                        <img 
                          src={item.img} 
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        item.badge || "⚽"
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#333" }}>
                        {item.name}
                      </h4>
                      <div style={{ display: "flex", gap: "15px", fontSize: "14px", color: "#666" }}>
                        <span>Size: <strong>{item.size}</strong></span>
                        <span>Team: <strong>{item.team}</strong></span>
                      </div>
                      <div style={{ marginTop: "8px", fontSize: "20px", fontWeight: "bold", color: "#28a745" }}>
                        ${Number(item.price) || 0}
                        {/* Debug price */}
                        <span style={{ fontSize: "12px", color: "#666", marginLeft: "10px" }}>
                          (Price: {typeof item.price} = {item.price})
                        </span>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeItem(item.cartId)}
                      style={{
                        background: "rgba(255, 77, 77, 0.1)",
                        color: "#ff4d4d",
                        border: "none",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        fontSize: "18px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Footer with Total and Checkout */}
        {cart.length > 0 && (
          <div style={{
            padding: "25px 30px",
            borderTop: "2px solid #e9ecef",
            background: "white"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <div>
                <div style={{ fontSize: "14px", color: "#666" }}>Total</div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#28a745" }}>
                  ${total.toFixed(2)}
                  <span style={{ fontSize: "14px", color: "#666", marginLeft: "10px" }}>
                    (Items: {itemCount})
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", color: "#666" }}>Debug Total</div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
                  ${debugTotal.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "15px" }}>
              <button 
                onClick={close}
                style={{
                  flex: 1,
                  background: "transparent",
                  color: "#333",
                  border: "2px solid #e9ecef",
                  padding: "15px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Continue Shopping
              </button>
              
              <button 
                onClick={toCheckout}
                style={{
                  flex: 1,
                  background: "linear-gradient(45deg, #28a745, #20c997)",
                  color: "white",
                  border: "none",
                  padding: "15px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
              >
                <span>💳</span>
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


