import express from "express";
import cors from "cors";
import morgan from "morgan";
import { productRoutes } from "./routes/product.routes";
import { notFoundMiddleware } from "./middlewares/not-found.middlware";
import { errorMiddleware } from "./middlewares/error.middleware";

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

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;