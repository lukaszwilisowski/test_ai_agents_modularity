import { Product } from "@/types";

export class ProductModel {
  static async findAll(): Promise<Product[]> {
    return [];
  }

  static async findById(id: string): Promise<Product | null> {
    return null;
  }

  static async create(product: Omit<Product, "id">): Promise<Product> {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...product,
    };
    return newProduct;
  }

  static async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    return null;
  }

  static async delete(id: string): Promise<boolean> {
    return false;
  }
}