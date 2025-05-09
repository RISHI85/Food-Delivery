import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import mongoose from "mongoose";
import 'dotenv/config'
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port = 4000;

// DB connection 
connectDB();

// middlewares
app.use(cors());
app.use("/uploads", express.static("uploads"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Mount foodRouter before JSON/body parsing
app.use("/api/food", foodRouter);
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);


app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
