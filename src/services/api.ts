import Constants from 'expo-constants';
import type { Newsflash, CreateNewsflashData, User } from '@/types';

// Get API URL from app config
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://localhost:3000';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // Newsflash API methods
  async getNewsflashes(userId: string): Promise<Newsflash[]> {
    const response = await this.request<Newsflash[]>(`/newsflashes?userId=${userId}`);
    return response.data;
  }

  async createNewsflash(data: CreateNewsflashData): Promise<Newsflash> {
    const response = await this.request<Newsflash>('/newsflashes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getNewsflash(id: string): Promise<Newsflash> {
    const response = await this.request<Newsflash>(`/newsflashes/${id}`);
    return response.data;
  }

  async deleteNewsflash(id: string): Promise<void> {
    await this.request<void>(`/newsflashes/${id}`, {
      method: 'DELETE',
    });
  }

  // User API methods
  async getUser(id: string): Promise<User> {
    const response = await this.request<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  // AI transformation API
  async transformText(text: string): Promise<{ headline: string; transformedText: string; sentiment: string }> {
    const response = await this.request<{ headline: string; transformedText: string; sentiment: string }>('/ai/transform', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export { ApiError };
export type { ApiResponse }; 