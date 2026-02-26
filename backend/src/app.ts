import express from "express";
import authRouter from "./modules/auth/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.routes.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is running" });
});
