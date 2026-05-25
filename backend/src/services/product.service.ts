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
}