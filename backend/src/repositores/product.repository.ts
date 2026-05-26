import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../config/database";
import { Product } from "../types/product";
import { CreateProductDTO, UpdateProductDTO } from "../schemas/product.schema";

interface ProductRow extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    const [rows] = await pool.execute<ProductRow[]>(
      `SELECT id, name, description, price, category, active, created_at, updated_at
       FROM products
       ORDER BY created_at DESC`,
    );

    return rows.map((row) => this.mapRowToProduct(row));
  }

  async findById(id: number): Promise<Product | null> {
    const [rows] = await pool.execute<ProductRow[]>(
      `SELECT id, name, description, price, category, active, created_at, updated_at
       FROM products
       WHERE id = ?`,
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return this.mapRowToProduct(rows[0]);
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO products (name, description, price, category, active)
       VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.description, data.price, data.category, data.active],
    );

    const createdProduct = await this.findById(result.insertId);

    if (!createdProduct) {
      throw new Error("Failed to create product");
    }

    return createdProduct;
  }

  async update(id: number, data: UpdateProductDTO): Promise<Product | null> {
    const existingProduct = await this.findById(id);

    if (!existingProduct) {
      return null;
    }

    const updatedData = {
      name: data.name ?? existingProduct.name,
      description: data.description ?? existingProduct.description,
      price: data.price ?? existingProduct.price,
      category: data.category ?? existingProduct.category,
      active: data.active ?? existingProduct.active,
    };

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE products
      SET name = ?, description = ?, price = ?, category = ?, active = ?
      WHERE id = ?`,
      [
        updatedData.name,
        updatedData.description,
        updatedData.price,
        updatedData.category,
        updatedData.active,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM products
      WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }

  private mapRowToProduct(row: ProductRow): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      category: row.category,
      active: Boolean(row.active),
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    };
  }
}