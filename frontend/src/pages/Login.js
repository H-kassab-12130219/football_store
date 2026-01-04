import React, { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginUser({ email, password });
      
      if (result.error) {
        setError(result.error);
      } else {
        // Save user data and token
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", "dummy-token"); // In real app, save actual JWT
        
        // Notify parent component
        if (onLogin) onLogin(result.user);
        
        // Redirect to home
        window.location.href = "/";
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{ 
          textAlign: "center", 
          color: "#333", 
          marginBottom: "30px",
          fontSize: "28px"
        }}>
          ⚽ Login to Football Store
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600", 
              color: "#333" 
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600", 
              color: "#333" 
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#ccc" : "linear-gradient(45deg, #28a745, #20c997)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "20px"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", marginBottom: "10px" }}>
            Don't have an account?
          </p>
          <button
            onClick={goToRegister}
            style={{
              background: "transparent",
              color: "#007bff",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
