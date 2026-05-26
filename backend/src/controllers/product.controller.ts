import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";

export class ProductController {

  constructor(private readonly productService: ProductService) {}

    getAll = async (
        _request: Request, 
        response: Response,
        next: NextFunction
        ): Promise<void> => {
        try {
            const products = await this.productService.getAllProducts();
            response.status(200).json(products);
        } catch (error) {
            next(error);
        }
    };

    getById = async (
        request: Request, 
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
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
        } catch (error) {
            next(error);
        }
    };

    create = async (
        request: Request, 
        response: Response, 
        next: NextFunction
    ): Promise<void> => {
        try {
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
        } catch (error) {
            next(error);
        }
    };

    update = async (
        request: Request, 
        response: Response, 
        next: NextFunction
    ): Promise<void> => {
        try {
        const id = Number(request.params.id);

        if (Number.isNaN(id)) {
            response.status(400).json({ message: "ID de produto inválido" });
            return;
        }

        const result = updateProductSchema.safeParse(request.body);

        if (!result.success) {
            response.status(400).json({
                message: "Erro de validação",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        if (Object.keys(result.data).length === 0) {
            response.status(400).json({
                message: "Pelo menos um campo deve ser fornecido para atualização",
            });
            return;
        }

        const updatedProduct = await this.productService.updateProduct(id, result.data);

        if (!updatedProduct) {
            response.status(404).json({ message: "Produto não encontrado" });
            return;
        }

        response.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    };

    delete = async (
        request: Request, 
        response: Response, 
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = Number(request.params.id);

        if (Number.isNaN(id)) {
            response.status(400).json({ message: "ID de produto inválido" });
            return;
        }

        const deleted = await this.productService.deleteProduct(id);

        if (!deleted) {
            response.status(404).json({ message: "Produto não encontrado" });
            return;
        }

        response.status(200).json({ message: "Produto deletado com sucesso" });
        } catch (error) {
            next(error);
        }
    };
}