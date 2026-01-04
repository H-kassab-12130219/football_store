import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

export default function Checkout({ goHome, user }) {
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", 
    city: "", state: "", postal: "", country: "USA",
    card: "", expiry: "", cvv: "", saveInfo: false
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username,
        email: user.email || ""
      }));
    }
  }, [user]);

  // Calculate total
  const calculateTotal = () => {
    if (!cart || cart.length === 0) return 0;
    
    const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + price;
    }, 0);
    
    return parseFloat(total.toFixed(2));
  };

  const total = calculateTotal();
  const shipping = total > 100 ? 0 : 9.99;
  const tax = parseFloat((total * 0.08).toFixed(2));
  const finalTotal = parseFloat((total + shipping + tax).toFixed(2));

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (activeStep === 1) {
      if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.state || !formData.postal) {
        setError("Please fill in all required shipping fields");
        return;
      }
    }
    
    if (activeStep === 2) {
      if (!formData.card || !formData.expiry || !formData.cvv) {
        setError("Please fill in all payment details");
        return;
      }
    }
    
    if (activeStep === 3) {
      setLoading(true);
      setError("");
      
      try {
        // Prepare order data
        const orderData = {
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            team: item.team,
            size: item.size || "M",
            quantity: 1,
            price: parseFloat(item.price) || 0
          })),
          total: total,
          shipping: shipping,
          tax: tax,
          finalTotal: finalTotal,
          customerName: formData.name,
          customerEmail: formData.email,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.postal}`,
          paymentMethod: formData.card ? "Card" : "Other"
        };

        // Send to backend
        const result = await createOrder(orderData);
        
        if (result.error) {
          setError("Order failed: " + (result.message || result.error));
          setLoading(false);
        } else {
          // Save user info if requested
          if (formData.saveInfo) {
            localStorage.setItem("userInfo", JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone
            }));
          }

          // Save order details for success page
          setOrderDetails({
            orderNumber: result.orderNumber || `ORD-${Date.now()}`,
            orderId: result.orderId,
            total: finalTotal,
            items: cart.length,
            date: new Date().toISOString()
          });

          // Clear cart
          clearCart();
          
          // Save order locally as backup
          localStorage.setItem("lastOrder", JSON.stringify({
            ...orderData,
            orderId: result.orderId || `ORD-${Date.now()}`,
            orderNumber: result.orderNumber || `ORD-${Date.now()}`,
            date: new Date().toISOString()
          }));

          setLoading(false);
          setOrderPlaced(true);
        }
      } catch (err) {
        console.error("Order error:", err);
        setError("Failed to place order. Please try again.");
        setLoading(false);
      }
    } else {
      nextStep();
    }
  };

  const nextStep = () => {
    if (activeStep < 3) {
      setError("");
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setError("");
      setActiveStep(activeStep - 1);
    }
  };

  if (orderPlaced && orderDetails) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #00b09b, #96c93d)",
        padding: "20px"
      }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "25px",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
        }}>
          <div style={{ 
            fontSize: "80px", 
            marginBottom: "20px",
            animation: "bounce 1s infinite"
          }}>
            🎉
          </div>
          <h1 style={{ 
            color: "#00b09b", 
            marginBottom: "15px",
            fontSize: "42px",
            fontWeight: 800
          }}>
            Order Confirmed!
          </h1>
          
          <div style={{
            background: "#f1f8e9",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px",
            textAlign: "left"
          }}>
            <h3 style={{ color: "#155724", marginBottom: "15px" }}>Order Details</h3>
            <p style={{ margin: "8px 0", color: "#666" }}>
              <strong>Order Number:</strong> {orderDetails.orderNumber}
            </p>
            <p style={{ margin: "8px 0", color: "#666" }}>
              <strong>Items:</strong> {orderDetails.items} football kit(s)
            </p>
            <p style={{ margin: "8px 0", color: "#666" }}>
              <strong>Total:</strong> ${orderDetails.total.toFixed(2)}
            </p>
            <p style={{ margin: "8px 0", color: "#666" }}>
              <strong>Date:</strong> {new Date(orderDetails.date).toLocaleDateString()}
            </p>
          </div>
          
          <p style={{ 
            fontSize: "16px", 
            color: "#666", 
            marginBottom: "30px",
            padding: "15px",
            background: "#e7f5ff",
            borderRadius: "10px"
          }}>
            ✅ A confirmation email has been sent to <strong>{formData.email}</strong>. 
            Your items will be shipped within 2-3 business days.
          </p>
          
          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <button 
              onClick={goHome}
              style={{
                background: "linear-gradient(45deg, #00b09b, #00cec9)",
                color: "white",
                border: "none",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flex: 1
              }}
              onMouseOver={e => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 10px 25px rgba(0, 176, 155, 0.4)";
              }}
              onMouseOut={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              🏠 Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px"
      }}>
        <div style={{
          background: "white",
          padding: "50px",
          borderRadius: "20px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
        }}>
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🛒</div>
          <h1 style={{ color: "#333", marginBottom: "15px" }}>Your cart is empty</h1>
          <p style={{ color: "#666", marginBottom: "30px", fontSize: "18px" }}>
            Add some football kits before checking out!
          </p>
          <button 
            onClick={goHome}
            style={{
              background: "linear-gradient(45deg, #007bff, #0056b3)",
              color: "white",
              border: "none",
              padding: "16px 40px",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s",
              width: "100%"
            }}
            onMouseOver={e => e.target.style.transform = "translateY(-3px)"}
            onMouseOut={e => e.target.style.transform = "translateY(0)"}
          >
            Browse Football Kits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <button 
            onClick={goHome}
            style={{
              background: "transparent",
              color: "#333",
              border: "2px solid #333",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.3s"
            }}
            onMouseOver={e => {
              e.target.style.background = "#333";
              e.target.style.color = "white";
              e.target.style.transform = "translateX(-5px)";
            }}
            onMouseOut={e => {
              e.target.style.background = "transparent";
              e.target.style.color = "#333";
              e.target.style.transform = "translateX(0)";
            }}
          >
            ← Back to Store
          </button>
          
          <div style={{ textAlign: "center" }}>
            <h1 style={{ 
              fontSize: "42px", 
              color: "#333", 
              margin: "0 0 10px 0",
              background: "linear-gradient(45deg, #1a1a2e, #16213e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800
            }}>
              Checkout
            </h1>
            <p style={{ color: "#666", fontSize: "16px", margin: 0 }}>
              Complete your purchase in 3 easy steps
            </p>
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px",
            background: "white",
            padding: "10px 20px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
          }}>
            <span style={{ color: "#666" }}>Items:</span>
            <span style={{ 
              background: "#ff4d4d", 
              color: "white",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold"
            }}>
              {cart.length}
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          position: "relative",
          maxWidth: "800px",
          margin: "0 auto 40px"
        }}>
          <div style={{
            position: "absolute",
            top: "20px",
            left: "0",
            right: "0",
            height: "4px",
            background: "#e9ecef",
            zIndex: 1
          }}></div>
          <div style={{
            position: "absolute",
            top: "20px",
            left: "0",
            width: `${(activeStep - 1) * 50}%`,
            height: "4px",
            background: "linear-gradient(45deg, #28a745, #20c997)",
            zIndex: 2,
            transition: "width 0.5s ease"
          }}></div>
          
          {[1, 2, 3].map((step) => (
            <div key={step} style={{ textAlign: "center", zIndex: 3 }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: activeStep >= step ? "linear-gradient(45deg, #28a745, #20c997)" : "#e9ecef",
                color: activeStep >= step ? "white" : "#adb5bd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "18px",
                margin: "0 auto 10px",
                boxShadow: activeStep >= step ? "0 4px 15px rgba(40, 167, 69, 0.3)" : "none"
              }}>
                {step}
              </div>
              <div style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: activeStep >= step ? "#28a745" : "#adb5bd"
              }}>
                {step === 1 ? "Shipping" : step === 2 ? "Payment" : "Review"}
              </div>
            </div>
          ))}
        </div>

        {/* User Info (if logged in) */}
        {user && (
          <div style={{
            background: "#e7f5ff",
            padding: "15px 25px",
            borderRadius: "10px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{ fontSize: "20px" }}>👤</span>
            <div>
              <p style={{ margin: 0, fontWeight: "bold", color: "#0066cc" }}>
                Welcome, {user.username || user.email}!
              </p>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>
                Your order will be linked to your account.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* Form Section */}
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
          }}>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Shipping */}
              {activeStep === 1 && (
                <div>
                  <h2 style={{ 
                    color: "#333", 
                    marginBottom: "30px", 
                    fontSize: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                  }}>
                    <span>🚚</span>
                    Shipping Information
                  </h2>
                  
                  <div style={{ display: "grid", gap: "20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                          Full Name *
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          style={{
                            width: "100%",
                            padding: "14px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "10px",
                            fontSize: "16px",
                            transition: "all 0.3s"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                          Email *
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{
                            width: "100%",
                            padding: "14px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "10px",
                            fontSize: "16px",
                            transition: "all 0.3s"
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          width: "100%",
                          padding: "14px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "10px",
                          fontSize: "16px",
                          transition: "all 0.3s"
                        }}
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                        Address *
                      </label>
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "14px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "10px",
                          fontSize: "16px",
                          transition: "all 0.3s"
                        }}
                      />
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                          City *
                        </label>
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          style={{
                            width: "100%",
                            padding: "14px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "10px",
                            fontSize: "16px",
                            transition: "all 0.3s"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                          State *
                        </label>
                        <input
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          style={{
                            width: "100%",
                            padding: "14px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "10px",
                            fontSize: "16px",
                            transition: "all 0.3s"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                          Postal Code *
                        </label>
                        <input
                          name="postal"
                          value={formData.postal}
                          onChange={handleChange}
                          required
                          style={{
                            width: "100%",
                            padding: "14px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "10px",
                            fontSize: "16px",
                            transition: "all 0.3s"
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        style={{
                          width: "100%",
                          padding: "14px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "10px",
                          fontSize: "16px",
                          backgroundColor: "white"
                        }}
                      >
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {activeStep === 2 && (
                <div>
                  <h2 style={{ 
                    color: "#333", 
                    marginBottom: "30px", 
                    fontSize: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                  }}>
                    <span>💳</span>
                    Payment Details
                  </h2>
                  
                  <div style={{ display: "grid", gap: "20px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                        Card Number *
                      </label>
                      <input
                        name="card"
                        value={formData.card}
                        onChange={handleChange}
                        required
                        placeholder="1234 5678 9012 3456"
                        style={{
                          width: "100%",
                          padding: "14px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "10px",
                          fontSize: "16px",
                          transition: "all 0.3s"
                        }}
                      />
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                          Expiry Date *
                        </label>
                        <input
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleChange}
                          required
                          placeholder="MM/YY"
                          style={{
                            width: "100%",
                            padding: "14px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "10px",
                            fontSize: "16px",
                            transition: "all 0.3s"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                          CVV *
                        </label>
                        <input
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          required
                          placeholder="123"
                          style={{
                            width: "100%",
                            padding: "14px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "10px",
                            fontSize: "16px",
                            transition: "all 0.3s"
                          }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleChange}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <label style={{ color: "#666", fontSize: "14px" }}>
                        Save my information for faster checkout next time
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {activeStep === 3 && (
                <div>
                  <h2 style={{ 
                    color: "#333", 
                    marginBottom: "30px", 
                    fontSize: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                  }}>
                    <span>✅</span>
                    Review Order
                  </h2>
                  
                  <div style={{ 
                    background: "#f8f9fa", 
                    padding: "25px", 
                    borderRadius: "15px",
                    marginBottom: "30px"
                  }}>
                    <h3 style={{ color: "#333", marginBottom: "20px" }}>Shipping to:</h3>
                    <p style={{ margin: "5px 0", color: "#666" }}><strong>{formData.name}</strong></p>
                    <p style={{ margin: "5px 0", color: "#666" }}>{formData.address}</p>
                    <p style={{ margin: "5px 0", color: "#666" }}>{formData.city}, {formData.state} {formData.postal}</p>
                    <p style={{ margin: "5px 0", color: "#666" }}>{formData.country}</p>
                    <p style={{ margin: "10px 0 0 0", color: "#666" }}>📧 {formData.email}</p>
                    {formData.phone && <p style={{ margin: "5px 0", color: "#666" }}>📞 {formData.phone}</p>}
                  </div>
                  
                  <div style={{ 
                    background: "#f8f9fa", 
                    padding: "25px", 
                    borderRadius: "15px",
                    marginBottom: "30px"
                  }}>
                    <h3 style={{ color: "#333", marginBottom: "20px" }}>Payment Method:</h3>
                    <p style={{ margin: "5px 0", color: "#666" }}>
                      💳 Card ending in {formData.card ? formData.card.slice(-4) : "____"}
                    </p>
                    <p style={{ margin: "5px 0", color: "#666" }}>
                      Expires: {formData.expiry || "MM/YY"}
                    </p>
                  </div>
                  
                  <div style={{ 
                    background: "#fff3cd", 
                    padding: "15px", 
                    borderRadius: "10px",
                    border: "1px solid #ffeaa7"
                  }}>
                    <p style={{ margin: 0, color: "#856404" }}>
                      <strong>Note:</strong> This is a demo store. No real payment will be processed.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div style={{
                  background: "#f8d7da",
                  color: "#721c24",
                  padding: "15px",
                  borderRadius: "10px",
                  marginTop: "20px",
                  border: "1px solid #f5c6cb",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: "40px",
                gap: "15px"
              }}>
                {activeStep > 1 ? (
                  <button 
                    type="button"
                    onClick={prevStep}
                    style={{
                      background: "transparent",
                      color: "#666",
                      border: "2px solid #e2e8f0",
                      padding: "15px 30px",
                      borderRadius: "10px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      flex: 1
                    }}
                  >
                    ← Back
                  </button>
                ) : (
                  <div style={{ flex: 1 }}></div>
                )}
                
                <button 
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? "#ccc" : (activeStep === 3 ? "linear-gradient(45deg, #28a745, #20c997)" : "linear-gradient(45deg, #007bff, #0056b3)"),
                    color: "white",
                    border: "none",
                    padding: "15px 30px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s",
                    flex: activeStep === 3 ? 2 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                  }}
                >
                  {loading ? (
                    <>
                      <span>⏳</span>
                      Processing...
                    </>
                  ) : activeStep === 3 ? (
                    <>
                      <span>✅</span>
                      Place Order - ${finalTotal.toFixed(2)}
                    </>
                  ) : (
                    <>
                      Continue to {activeStep === 1 ? "Payment" : "Review"}
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            height: "fit-content",
            position: "sticky",
            top: "40px"
          }}>
            <h2 style={{ 
              color: "#333", 
              marginBottom: "30px", 
              fontSize: "28px",
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}>
              <span>📦</span>
              Order Summary
            </h2>
            
            <div style={{ marginBottom: "30px", maxHeight: "300px", overflowY: "auto" }}>
              {cart.map((item, index) => (
                <div key={item.cartId || index} style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px 0",
                  borderBottom: "1px solid #e9ecef",
                  gap: "15px"
                }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: item.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    color: "white",
                    flexShrink: 0
                  }}>
                    {item.badge || "⚽"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", color: "#333" }}>
                      {item.name || "Football Kit"}
                    </h4>
                    <div style={{ display: "flex", gap: "15px", fontSize: "13px", color: "#666" }}>
                      <span>Size: <strong>{item.size || "M"}</strong></span>
                      <span>Team: <strong>{item.team}</strong></span>
                    </div>
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: "#28a745" }}>
                    ${parseFloat(item.price || 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Price Breakdown */}
            <div style={{ 
              background: "#f8f9fa", 
              padding: "25px", 
              borderRadius: "15px",
              marginBottom: "30px"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: "12px",
                fontSize: "15px",
                color: "#666"
              }}>
                <span>Subtotal ({cart.length} items):</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: "12px",
                fontSize: "15px",
                color: "#666"
              }}>
                <span>Shipping:</span>
                <span style={{ color: shipping === 0 ? "#28a745" : "#666" }}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: "15px",
                fontSize: "15px",
                color: "#666"
              }}>
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                paddingTop: "15px",
                borderTop: "2px solid #dee2e6",
                fontSize: "22px",
                fontWeight: "bold",
                color: "#333"
              }}>
                <span>Total:</span>
                <span style={{ color: "#28a745" }}>${finalTotal.toFixed(2)}</span>
              </div>
              
              {shipping > 0 && total < 100 && (
                <div style={{ 
                  marginTop: "15px", 
                  padding: "10px",
                  background: "#e7f5ff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#0066cc",
                  textAlign: "center"
                }}>
                  🚚 Add <strong>${(100 - total).toFixed(2)}</strong> more for FREE shipping!
                </div>
              )}
            </div>
            
            {/* Security Badge */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "15px",
              padding: "15px",
              background: "#f1f8e9",
              borderRadius: "10px",
              border: "1px solid #d4edda"
            }}>
              <div style={{ fontSize: "30px" }}>🔒</div>
              <div>
                <div style={{ fontWeight: "bold", color: "#155724" }}>Secure Checkout</div>
                <div style={{ fontSize: "13px", color: "#28a745" }}>
                  256-bit SSL encryption • No real payment processed
                </div>
              </div>
            </div>
            
            {/* Login Reminder */}
            {!user && (
              <div style={{ 
                marginTop: "20px", 
                padding: "15px",
                background: "#fff3cd",
                borderRadius: "10px",
                border: "1px solid #ffeaa7"
              }}>
                <div style={{ fontWeight: "bold", color: "#856404", marginBottom: "5px" }}>
                  🔐 Create an account
                </div>
                <div style={{ fontSize: "14px", color: "#856404" }}>
                  Login or register to save your order history and get faster checkout.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}