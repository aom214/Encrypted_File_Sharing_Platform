import express from "express";
import cors from 'cors';
import routes from './routes/index.js';

const app = express()

console.log("app is running")


app.use(express.json()); // Parse JSON bodies

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(cors({origin:process.env.ORIGIN})); // Enable CORS

app.use("/api/v1",routes)

export default app 