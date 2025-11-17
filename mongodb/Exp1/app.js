// CRUD Operations for Product Database Using Mongoose

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
app.use(express.json()); // Parse JSON data from requests

// Routes
app.use("/api/products", productRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Product API is running ");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT, () =>
      console.log(`Server running at http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("Database connection error:", err));
