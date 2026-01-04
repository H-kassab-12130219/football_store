import React from "react";
import { useCart } from "../context/CartContext";

export default function KitCard({ kit }) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = React.useState("M");

    if (!kit) return null;

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        
        const cartItem = addToCart(kit, selectedSize);
        console.log("🛒 Added to cart:", cartItem);
        alert(`Added ${kit.name} (${selectedSize}) to cart!`);
    };

    return (
        <div style={{
            background: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            transition: "all 0.3s",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* Color Gradient Header */}
            <div 
                style={{
                    height: "180px",
                    background: kit.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                }}
            >
                <div style={{
                    fontSize: "60px",
                    color: "white",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                }}>
                    {kit.badge || "⚽"}
                </div>
                
                {/* Team Badge */}
                <div style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "bold"
                }}>
                    {kit.team}
                </div>
            </div>

            {/* Content */}
            <div style={{ 
                padding: "20px", 
                flex: 1,
                display: "flex",
                flexDirection: "column"
            }}>
                <h3 style={{ 
                    margin: "0 0 10px 0", 
                    fontSize: "18px",
                    color: "#333",
                    minHeight: "44px"
                }}>
                    {kit.name}
                </h3>
                
                <p style={{ 
                    color: "#666", 
                    fontSize: "14px",
                    margin: "0 0 15px 0",
                    flex: 1
                }}>
                    {kit.description || "Official football kit"}
                </p>
                
                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px"
                }}>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#28a745" }}>
                        ${kit.price ? parseFloat(kit.price).toFixed(2) : "0.00"}
                    </div>
                    
                    <div style={{ 
                        background: kit.stock > 5 ? "#d4edda" : "#f8d7da",
                        color: kit.stock > 5 ? "#155724" : "#721c24",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "12px",
                        fontWeight: "bold"
                    }}>
                        {kit.stock || 0} in stock
                    </div>
                </div>
            </div>

            {/* Size Selection & Add to Cart */}
            <div style={{ 
                padding: "15px 20px 20px",
                background: "#f8f9fa",
                borderTop: "1px solid #e9ecef"
            }}>
                {/* Size Selection */}
                <div style={{ marginBottom: "15px" }}>
                    <div style={{ 
                        fontSize: "14px", 
                        color: "#666", 
                        marginBottom: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <span>Select Size:</span>
                        <span style={{ 
                            background: selectedSize ? "#007bff" : "#6c757d",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "12px"
                        }}>
                            {selectedSize || "Not selected"}
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {["S", "M", "L", "XL"].map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                style={{
                                    flex: 1,
                                    padding: "8px",
                                    background: selectedSize === size ? "#007bff" : "white",
                                    color: selectedSize === size ? "white" : "#333",
                                    border: `2px solid ${selectedSize === size ? "#007bff" : "#dee2e6"}`,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    transition: "all 0.2s"
                                }}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: !selectedSize ? "#6c757d" : "linear-gradient(45deg, #28a745, #20c997)",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: !selectedSize ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        transition: "all 0.3s"
                    }}
                    onMouseOver={e => {
                        if (selectedSize) {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 5px 15px rgba(40, 167, 69, 0.3)";
                        }
                    }}
                    onMouseOut={e => {
                        if (selectedSize) {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                        }
                    }}
                >
                    <span>🛒</span>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}