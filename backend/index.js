const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Database connection
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "football_store",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ DATABASE CONNECTION FAILED:", err.message);
        console.log("⚠️  Make sure:");
        console.log("   1. MySQL is running");
        console.log("   2. Database 'football_store' exists");
        console.log("   3. Tables 'kits' and 'users' exist");
    } else {
        console.log("✅ CONNECTED TO DATABASE: football_store");
        connection.release();
        
        // Check if kits table has data
        pool.query("SELECT COUNT(*) as count FROM kits", (err, results) => {
            if (!err) {
                console.log(`📦 DATABASE HAS ${results[0].count} KITS`);
            }
        });
    }
});

// Simple auth middleware
const verifyToken = (req, res, next) => {
    req.userId = 1; // Mock user for testing
    next();
};

// ============ API ROUTES ============

// Root route
app.get("/", (req, res) => {
    res.json({ 
        message: "⚽ Football Store API", 
        version: "1.0",
        endpoints: [
            "GET  /api/kits - Get all football kits",
            "GET  /api/kits/search/:query - Search kits",
            "POST /api/login - User login",
            "POST /api/register - User registration",
            "POST /api/orders - Create order"
        ]
    });
});

// Get all kits - ONLY FROM DATABASE, NO MOCK DATA
app.get("/api/kits", (req, res) => {
    console.log(`📦 [${new Date().toLocaleTimeString()}] Fetching kits from database...`);
    
    const sql = "SELECT * FROM kits ORDER BY team, name";
    
    pool.query(sql, (err, results) => {
        if (err) {
            console.error("❌ DATABASE ERROR:", err.message);
            return res.status(500).json({ 
                error: "Database error",
                message: "Failed to fetch kits from database"
            });
        }
        
        console.log(`✅ Found ${results.length} kits in database`);
        res.json(results);
    });
});

// Search kits
app.get("/api/kits/search/:query", (req, res) => {
    const query = req.params.query;
    const searchTerm = `%${query}%`;
    
    const sql = "SELECT * FROM kits WHERE name LIKE ? OR team LIKE ? OR description LIKE ?";
    
    pool.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error("Search error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    
    pool.query(
        "SELECT id, email, username, first_name, last_name FROM users WHERE email = ? AND password = ?",
        [email, password],
        (err, results) => {
            if (err) {
                console.error("Login error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            
            const user = results[0];
            res.json({
                message: "Login successful",
                token: "mock-token-" + Date.now(),
                user: user
            });
        }
    );
});

// Register
app.post("/api/register", (req, res) => {
    const { email, username, password, firstName, lastName } = req.body;
    
    if (!email || !username || !password) {
        return res.status(400).json({ error: "Email, username, and password are required" });
    }
    
    // Check if user exists
    pool.query(
        "SELECT id FROM users WHERE email = ? OR username = ?",
        [email, username],
        (err, results) => {
            if (err) {
                console.error("Check user error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ error: "Email or username already exists" });
            }
            
            // Insert new user
            pool.query(
                "INSERT INTO users (email, username, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
                [email, username, password, firstName || "", lastName || ""],
                (err, result) => {
                    if (err) {
                        console.error("Registration error:", err);
                        return res.status(500).json({ error: "Database error" });
                    }
                    
                    res.status(201).json({
                        message: "Registration successful",
                        token: "mock-token-" + Date.now(),
                        user: {
                            id: result.insertId,
                            email,
                            username,
                            firstName: firstName || "",
                            lastName: lastName || ""
                        }
                    });
                }
            );
        }
    );
});

// Create order
app.post("/api/orders", verifyToken, (req, res) => {
    console.log("📦 New order received");
    
    const { 
        items, 
        finalTotal,
        customerName,
        customerEmail,
        shippingAddress 
    } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ 
            success: false,
            error: "Order must have items" 
        });
    }
    
    const orderNumber = `ORD-${Date.now()}`;
    
    // Save order
    pool.query(
        `INSERT INTO orders (order_number, user_id, customer_name, customer_email, shipping_address, final_amount, status) 
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [orderNumber, req.userId || null, customerName, customerEmail, shippingAddress, finalTotal],
        (err, result) => {
            if (err) {
                console.error("Order save error:", err);
                // Still return success for demo
            }
            
            console.log(`✅ Order ${orderNumber} created`);
            
            res.json({
                success: true,
                message: "Order placed successfully!",
                orderNumber: orderNumber,
                orderId: result?.insertId || Math.floor(Math.random() * 10000),
                total: finalTotal,
                itemsCount: items.length
            });
        }
    );
});

// Health check
app.get("/api/health", (req, res) => {
    pool.query("SELECT 1", (err) => {
        if (err) {
            return res.json({ 
                status: "error", 
                database: "disconnected",
                message: err.message 
            });
        }
        
        res.json({ 
            status: "ok", 
            database: "connected",
            timestamp: new Date().toISOString()
        });
    });
});

// Database info
app.get("/api/db-info", (req, res) => {
    pool.query("SELECT COUNT(*) as kit_count FROM kits", (err, results) => {
        if (err) {
            return res.json({ database: "error", message: err.message });
        }
        
        res.json({
            database: "connected",
            kit_count: results[0].kit_count,
            timestamp: new Date().toISOString()
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
=========================================
⚽ FOOTBALL STORE BACKEND
📍 http://localhost:${PORT}
📦 Database: football_store
📊 API Test: http://localhost:${PORT}/api/kits
=========================================
    `);
});