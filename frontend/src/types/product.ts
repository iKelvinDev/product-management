export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category: string;
    active: boolean;
}