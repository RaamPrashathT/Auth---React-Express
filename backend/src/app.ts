import express from "express";
import authRouter from "./modules/auth/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Server is running" });
});
