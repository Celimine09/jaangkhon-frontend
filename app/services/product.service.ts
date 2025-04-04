// src/services/product.service.ts
import { api } from './api';

interface Product {
  userId: number;
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  isActive: boolean;
}

export const productService = {
  getProducts: async (category?: string): Promise<Product[]> => {
    let endpoint = '/products';
    if (category) {
      endpoint += `?category=${encodeURIComponent(category)}`;
    }
    const response = await api.get(endpoint);
    return response.data;
  },
  
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },
  
  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },
  
  deleteProduct: async (id: number): Promise<boolean> => {
    const response = await api.delete(`/products/${id}`);
    return response.success;
  }
};