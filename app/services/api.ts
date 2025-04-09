// src/services/api.ts
interface ApiOptions {
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchApi(endpoint: string, options: ApiOptions) {
  const { method, headers = {}, body } = options;

  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {


    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error ${response.status}:`, data);
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
}

// Helper functions for common API calls
export const api = {
  get: (endpoint: string) => fetchApi(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => fetchApi(endpoint, { method: 'POST', body }),
  put: (endpoint: string, body: any) => fetchApi(endpoint, { method: 'PUT', body }),
  delete: (endpoint: string) => fetchApi(endpoint, { method: 'DELETE' }),
};