import express from "express";
import cors from "cors";
import morgan from "morgan";
import { productRoutes } from "./routes/product.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    message: "API is running",
  });
});

app.use("/products", productRoutes);

export default app;