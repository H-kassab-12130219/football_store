import React from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-content">
        <div className="success-icon">🎉</div>
        <h1>Order Successful!</h1>
        <p className="success-message">
          Thank you for your purchase! Your football kit is being processed 
          and will be shipped within 2-3 business days.
        </p>
        <p className="confirmation">
          A confirmation email has been sent to your inbox.
        </p>
        
        <div className="success-actions">
          <button 
            className="return-home-btn"
            onClick={() => navigate("/")}
          >
            🏠 Return to Store
          </button>
          
          <button 
            className="view-orders-btn"
            onClick={() => navigate("/checkout")}
          >
            View Order Details
          </button>
        </div>
      </div>
    </div>
  );
}
