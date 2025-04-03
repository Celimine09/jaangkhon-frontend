// src/services/user.service.ts
import { api } from './api';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'freelancer';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const userService = {
  getUsers: async (role?: string): Promise<User[]> => {
    let endpoint = '/users';
    if (role) {
      endpoint += `?role=${encodeURIComponent(role)}`;
    }
    const response = await api.get(endpoint);
    return response.data;
  },
  
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  createUser: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const response = await api.post('/users', user);
    return response.data;
  },
  
  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },
  
  deleteUser: async (id: number): Promise<boolean> => {
    const response = await api.delete(`/users/${id}`);
    return response.success;
  }
};