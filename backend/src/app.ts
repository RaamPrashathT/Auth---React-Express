import express from 'express';
import authRouter from './modules/auth/auth.routes.js';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (_req, res) => {
  res.status(200).json({"message": "Server is running"})
})

