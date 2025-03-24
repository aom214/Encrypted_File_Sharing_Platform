import express from "express";
import cors from 'cors';
import routes from './routes/index.js';
import cookieParser from "cookie-parser";

const app = express()

console.log("app is running")

app.use(express.json()); // Parse JSON bodies

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(cors({ 
    origin: "https://cybersecurityfrontend.onrender.com", // Allow requests from frontend
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
app.use(cookieParser());
app.use("/api/v1",routes)


export default app 
