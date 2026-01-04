// API service for Football Store
const API_URL = "http://localhost:3001/api";

// ==================== KITS FUNCTIONS ====================

// Get all football kits - ONLY FROM BACKEND
export const getKits = async () => {
    console.log("🔄 API: Fetching kits from backend...");
    
    try {
        // Add timestamp to prevent caching
        const response = await fetch(`${API_URL}/kits?t=${Date.now()}`);
        
        console.log("🔄 API: Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ API: HTTP error:", response.status, errorText);
            throw new Error(`Failed to fetch kits: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ API: Received ${data.length} kits from backend`);
        
        if (data.error) {
            console.error("❌ API: Backend error:", data.error);
            return [];
        }
        
        return data;
        
    } catch (error) {
        console.error("❌ API: Network error:", error.message);
        
        // Return empty array - NO MOCK DATA
        console.log("⚠️ API: Returning empty array (no mock data)");
        return [];
    }
};

// Search kits by query
export const searchKits = async (query) => {
    console.log("🔍 API: Searching kits for:", query);
    
    try {
        const response = await fetch(`${API_URL}/kits/search/${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`🔍 API: Found ${data.length} kits for "${query}"`);
        return data;
        
    } catch (error) {
        console.error("🔍 API: Search failed:", error);
        return [];
    }
};

// ==================== AUTH FUNCTIONS ====================

// Login user
export const loginUser = async (credentials) => {
    console.log("🔐 API: Attempting login");
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        
        return data;
        
    } catch (error) {
        console.error("❌ API: Login failed:", error);
        return { error: "Login failed. Please check your connection." };
    }
};

// Register user
export const registerUser = async (userData) => {
    console.log("📝 API: Attempting registration");
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        
        return data;
        
    } catch (error) {
        console.error("❌ API: Registration failed:", error);
        return { error: "Registration failed. Please try again." };
    }
};

// ==================== ORDER FUNCTIONS ====================

// Create new order
export const createOrder = async (orderData) => {
    console.log("🚀 API: Sending order to backend");
    console.log("Order data:", orderData);
    
    try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers,
            body: JSON.stringify(orderData)
        });
        
        console.log("📥 API: Order response status:", response.status);
        
        const data = await response.json();
        console.log("📥 API: Order response:", data);
        
        return data;
        
    } catch (error) {
        console.error("❌ API: Order failed:", error);
        return { 
            success: false,
            error: "Failed to create order",
            message: error.message
        };
    }
};

// ==================== UTILITY FUNCTIONS ====================

// Test backend connection
export const testConnection = async () => {
    console.log("🔌 API: Testing backend connection...");
    
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        
        console.log("🔌 API: Backend health:", data);
        return { connected: response.ok, data };
        
    } catch (error) {
        console.error("❌ API: Connection test failed:", error);
        return { connected: false, error: error.message };
    }
};

// Get database info
export const getDatabaseInfo = async () => {
    try {
        const response = await fetch(`${API_URL}/db-info`);
        return await response.json();
    } catch (error) {
        console.error("Database info error:", error);
        return { error: error.message };
    }
};

// Logout user
export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Get current user
export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    try {
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

// Check if user is logged in
export const isLoggedIn = () => {
    return localStorage.getItem("token") !== null;
};

// Export all functions
export default {
    getKits,
    searchKits,
    loginUser,
    registerUser,
    createOrder,
    testConnection,
    getDatabaseInfo,
    logoutUser,
    getCurrentUser,
    isLoggedIn
};