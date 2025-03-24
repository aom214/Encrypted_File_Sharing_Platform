import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

console.log("✅ Server is running...");

// CORS Configuration
const corsOptions = {
    origin: ["https://cybersecurityfrontend.onrender.com", "http://localhost:3000", "*"], // Frontend URLs
    credentials: true, // Allow cookies & authentication headers
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Ensure OPTIONS is handled
    allowedHeaders: "Content-Type,Authorization"
};

// Apply CORS Middleware First
app.use(cors(corsOptions));

// Middleware for Parsing Requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Enable reading cookies

// Handle Preflight Requests
app.options("*", cors(corsOptions)); 

// Define Routes
app.use("/api/v1", routes);

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Export Express App
export default app;
