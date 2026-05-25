import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { createProductSchema } from "../schemas/product.schema";

export class ProductController {
  constructor(private readonly productService: ProductService) {}
    getAll = async (_request: Request, response: Response): Promise<void> => {
      const products = await this.productService.getAllProducts();
      response.status(200).json(products);
    };

    getById = async (request: Request, response: Response): Promise<void> => {
        const id = Number(request.params.id);

        if (Number.isNaN(id)) {
            response.status(400).json({ message: "ID de produto inválido" });
            return;
        }

        const product = await this.productService.getProductById(id);

        if (!product) {
            response.status(404).json({ message: "Produto não encontrado" });
            return;
        }

        response.status(200).json(product);
    };

    create = async (request: Request, response: Response): Promise<void> => {
        const result = createProductSchema.safeParse(request.body);

        if (!result.success) {
            response.status(400).json({
                message: "Erro de validação",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        const product = await this.productService.createProduct(result.data);

        response.status(201).json(product);
    }
}