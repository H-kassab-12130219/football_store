import React, { useState } from "react";
import { registerUser } from "../services/api";

export default function Register({ onRegister, goToLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await registerUser(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Registration successful! You can now login.");
        // Clear form
        setFormData({
          email: "",
          username: "",
          password: "",
          firstName: "",
          lastName: ""
        });
        
        // Auto-redirect to login after 2 seconds
        setTimeout(() => {
          if (goToLogin) goToLogin();
        }, 2000);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
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
        maxWidth: "450px"
      }}>
        <h1 style={{ 
          textAlign: "center", 
          color: "#333", 
          marginBottom: "30px",
          fontSize: "28px"
        }}>
          ⚽ Create Account
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#666" }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
                placeholder="First name"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#666" }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
                placeholder="Last name"
              />
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#666" }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
              placeholder="Choose a username"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#666" }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#666" }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
              placeholder="Create a password"
            />
            <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Must be at least 6 characters long
            </p>
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

          {success && (
            <div style={{
              background: "#d4edda",
              color: "#155724",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#ccc" : "linear-gradient(45deg, #007bff, #0056b3)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "20px"
            }}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", marginBottom: "10px" }}>
            Already have an account?
          </p>
          <button
            onClick={goToLogin}
            style={{
              background: "transparent",
              color: "#007bff",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}
