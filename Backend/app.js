import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

console.log("✅ Server is running...");

// ✅ Proper CORS Setup
const corsOptions = {
    // origin: "https://cybersecurityfrontend.onrender.com", // ✅ Allow frontend URL
    origin:"http://localhost:3000",
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
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;
