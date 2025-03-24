import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

console.log("✅ Server is running...");

<<<<<<< HEAD
// ✅ Proper CORS Setup
const corsOptions = {
    origin: "https://cybersecurityfrontend.onrender.com", // ✅ Allow frontend URL
    credentials: true, // ✅ Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS Middleware BEFORE Routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle Preflight Requests

// ✅ Middleware for JSON, URL Encoding & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Define Routes
app.use("/api/v1", routes);

// ✅ Error Handling Middleware (Optional)
=======
// CORS Configuration
const corsOptions = {
    origin: ["https://cybersecurityproject-soi5.onrender.com/api/v1/user/Login","https://cybersecurityfrontend.onrender.com", "http://localhost:3000", "*"], // Frontend URLs
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
>>>>>>> c7e286d1bfe45c50e5be5921d106b6ef6d0304fb
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

<<<<<<< HEAD
=======
// Export Express App
>>>>>>> c7e286d1bfe45c50e5be5921d106b6ef6d0304fb
export default app;
