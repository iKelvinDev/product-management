import axios from "axios";
import type { Product, ProductFormData } from "../types/product";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productService = {
    async getAll(): Promise<Product[]> {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },

    async create(data: ProductFormData): Promise<Product> {
        const response = await api.post<Product>('/products', data);
        return response.data;
    },

    async update(id: number, data: ProductFormData): Promise<Product> {
        const response = await api.put<Product>(`/products/${id}`, data);
        return response.data;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/products/${id}`);
    },
};