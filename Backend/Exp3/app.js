// Account Transfer System with Balance Validation in Node.js

import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/transferRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/", userRoutes);

// Start Server
connectDB();
app.listen(3000, () => console.log(`Server running at http://localhost:${process.env.PORT}`));


