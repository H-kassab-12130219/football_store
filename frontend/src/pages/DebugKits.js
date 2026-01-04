import React, { useEffect, useState } from "react";
import { getKits, testConnection } from "../services/api";

export default function DebugKits() {
    const [kits, setKits] = useState([]);
    const [connection, setConnection] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        
        // Test connection
        const conn = await testConnection();
        setConnection(conn);
        
        // Get kits
        const data = await getKits();
        setKits(data);
        
        setLoading(false);
    };

    if (loading) {
        return <div>Loading debug info...</div>;
    }

    return (
        <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1>🔍 Debug: Kits Display</h1>
            
            {/* Connection Info */}
            <div style={{
                background: connection.connected ? "#d4edda" : "#f8d7da",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "30px"
            }}>
                <h2>Backend Connection</h2>
                <p><strong>Status:</strong> {connection.connected ? "✅ Connected" : "❌ Disconnected"}</p>
                <p><strong>Message:</strong> {connection.data?.message || connection.error}</p>
                <p><strong>Database:</strong> {connection.data?.database || "Unknown"}</p>
            </div>

            {/* Kits Info */}
            <div style={{
                background: "#e7f3ff",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "30px"
            }}>
                <h2>Kits Information</h2>
                <p><strong>Total Kits Received:</strong> {kits.length}</p>
                <p><strong>Kit IDs:</strong> {kits.map(k => k.id).join(", ")}</p>
            </div>

            {/* All Kits Table */}
            <h2>All Kits ({kits.length})</h2>
            <div style={{ overflowX: "auto" }}>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "white",
                    boxShadow: "0 0 20px rgba(0,0,0,0.1)"
                }}>
                    <thead>
                        <tr style={{ background: "#343a40", color: "white" }}>
                            <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Team</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Price</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Stock</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Gradient</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kits.map((kit, index) => (
                            <tr key={kit.id} style={{
                                borderBottom: "1px solid #dee2e6",
                                background: index % 2 === 0 ? "#f8f9fa" : "white"
                            }}>
                                <td style={{ padding: "12px" }}>{kit.id}</td>
                                <td style={{ padding: "12px", fontWeight: "bold" }}>{kit.name}</td>
                                <td style={{ padding: "12px" }}>{kit.team}</td>
                                <td style={{ padding: "12px", color: "#28a745", fontWeight: "bold" }}>
                                    ${parseFloat(kit.price).toFixed(2)}
                                </td>
                                <td style={{ padding: "12px" }}>
                                    <span style={{
                                        background: kit.stock > 5 ? "#d4edda" : "#f8d7da",
                                        color: kit.stock > 5 ? "#155724" : "#721c24",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        fontSize: "12px"
                                    }}>
                                        {kit.stock} in stock
                                    </span>
                                </td>
                                <td style={{ padding: "12px" }}>
                                    <div style={{
                                        width: "100px",
                                        height: "30px",
                                        background: kit.gradient,
                                        borderRadius: "5px",
                                        border: "1px solid #ddd"
                                    }}></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Grid Preview */}
            <h2>Grid Preview (How they appear on Home page)</h2>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
                marginTop: "20px"
            }}>
                {kits.map(kit => (
                    <div key={kit.id} style={{
                        border: "2px solid #007bff",
                        borderRadius: "10px",
                        padding: "15px",
                        background: "white"
                    }}>
                        <div style={{ 
                            display: "flex", 
                            alignItems: "center",
                            marginBottom: "10px"
                        }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                background: kit.gradient,
                                borderRadius: "5px",
                                marginRight: "10px"
                            }}></div>
                            <div>
                                <div style={{ fontWeight: "bold" }}>{kit.name}</div>
                                <div style={{ fontSize: "12px", color: "#666" }}>ID: {kit.id}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={loadData}
                style={{
                    marginTop: "30px",
                    padding: "12px 30px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px"
                }}
            >
                Refresh Data
            </button>
        </div>
    );
}