import { ProductRepository } from "../repositores/product.repository";
import { CreateProductDTO } from "../schemas/product.schema";
import { Product } from "../types/product";

export class ProductService {
    constructor(private productRepository: ProductRepository) {}
    
    async getAllProducts() {
        return this.productRepository.findAll();
    }

    async getProductById(id: number): Promise<Product | null> {
        return this.productRepository.findById(id);
    }

    async createProduct(data: CreateProductDTO): Promise<Product> {
        return this.productRepository.create(data);
    }

    async updateProduct(id: number, data: Partial<CreateProductDTO>): Promise<Product | null> {
        return this.productRepository.update(id, data);
    }

    async deleteProduct(id: number): Promise<boolean> {
        return this.productRepository.delete(id);
    }
}