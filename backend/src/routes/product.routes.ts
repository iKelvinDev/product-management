import { Router } from "express";
import { ProductRepository } from "../repositores/product.repository";
import { ProductService } from "../services/product.service";
import { ProductController } from "../controllers/product.controller";

const productRoutes = Router();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

productRoutes.get("/", productController.getAll);
productRoutes.get("/:id", productController.getById);
productRoutes.post("/", productController.create);

export { productRoutes };