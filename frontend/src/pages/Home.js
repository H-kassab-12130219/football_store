import React, { useState, useEffect } from "react";
import KitCard from "../components/KitCard";
import { getKits, searchKits, testConnection } from "../services/api";

export default function Home() {
    const [search, setSearch] = useState("");
    const [kits, setKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState("");

    // Test connection and load kits on start
    useEffect(() => {
        loadKitsWithCheck();
    }, []);

    const loadKitsWithCheck = async () => {
        setLoading(true);
        console.log("🏠 Home: Starting kit load...");
        
        // First test backend connection
        const connection = await testConnection();
        console.log("🏠 Home: Connection test:", connection);
        
        if (connection.connected) {
            setConnectionStatus("✅ Connected to backend");
            console.log("🏠 Home: Backend is connected, fetching kits...");
            
            // Fetch kits from backend
            const data = await getKits();
            console.log("🏠 Home: Received kits:", data.length);
            setKits(data);
            
        } else {
            setConnectionStatus("❌ Backend connection failed");
            console.log("🏠 Home: Backend failed, setting empty kits");
            setKits([]); // Empty array, no mock data
        }
        
        setLoading(false);
    };

    const handleSearch = async () => {
        if (!search.trim()) {
            loadKitsWithCheck();
            return;
        }
        
        setLoading(true);
        const data = await searchKits(search);
        setKits(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "80vh",
                fontSize: "20px",
                color: "#666",
                flexDirection: "column"
            }}>
                <div style={{ fontSize: "50px", marginBottom: "20px" }}>⚽</div>
                <p>Loading football kits...</p>
                <p style={{ fontSize: "14px", color: "#999", marginTop: "10px" }}>
                    {connectionStatus || "Checking backend connection..."}
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
            {/* Connection Status */}
            <div style={{ 
                marginBottom: "20px",
                padding: "10px",
                background: connectionStatus.includes("✅") ? "#d4edda" : "#f8d7da",
                color: connectionStatus.includes("✅") ? "#155724" : "#721c24",
                borderRadius: "5px",
                fontSize: "14px"
            }}>
                <strong>Status:</strong> {connectionStatus} | 
                <strong> Kits:</strong> {kits.length} found
            </div>

            {/* Search Bar */}
            <div style={{ 
                textAlign: "center", 
                marginBottom: "40px",
                padding: "20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "15px",
                color: "white"
            }}>
                <h1 style={{ marginBottom: "20px" }}>⚽ Football Kits Store</h1>
                
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <input
                        type="text"
                        placeholder="Search kits or teams..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{
                            width: "100%",
                            maxWidth: "500px",
                            padding: "15px 25px",
                            fontSize: "16px",
                            border: "none",
                            borderRadius: "30px",
                            outline: "none"
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        style={{
                            padding: "15px 30px",
                            fontSize: "16px",
                            border: "none",
                            borderRadius: "30px",
                            background: "#ff4d4d",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Search
                    </button>
                </div>
                
                <p style={{ marginTop: "15px" }}>
                    {kits.length} {kits.length === 1 ? 'kit' : 'kits'} available
                </p>
            </div>

            {/* Kits Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "25px",
                padding: "10px"
            }}>
                {kits.length > 0 ? (
                    kits.map(kit => (
                        <KitCard key={kit.id} kit={kit} />
                    ))
                ) : (
                    <div style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        padding: "50px"
                    }}>
                        <div style={{ fontSize: "60px", marginBottom: "20px" }}>😕</div>
                        <p style={{ fontSize: "20px", marginBottom: "20px" }}>
                            {connectionStatus.includes("✅") 
                                ? "No kits found in database" 
                                : "Cannot connect to backend"}
                        </p>
                        
                        {connectionStatus.includes("❌") && (
                            <div style={{ 
                                background: "#f8f9fa", 
                                padding: "20px", 
                                borderRadius: "10px",
                                maxWidth: "500px",
                                margin: "0 auto",
                                textAlign: "left"
                            }}>
                                <p><strong>Backend connection failed. Please:</strong></p>
                                <ol>
                                    <li>Make sure backend is running on port 3001</li>
                                    <li>Check if MySQL database is running</li>
                                    <li>Verify database 'football_store' exists</li>
                                    <li>Check if 'kits' table has data</li>
                                </ol>
                                <button 
                                    onClick={loadKitsWithCheck}
                                    style={{
                                        background: "#007bff",
                                        color: "white",
                                        border: "none",
                                        padding: "10px 20px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        marginTop: "10px"
                                    }}
                                >
                                    Retry Connection
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}