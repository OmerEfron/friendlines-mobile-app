import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/api';
import { ApiResponse, ApiError } from '../types/api';
import {
  User,
  CreateUserData,
  UserFollowStatus,
  FollowAction,
  UsersListResponse,
} from '../types/user';
import {
  Newsflash,
  CreateNewsflashData,
  UpdateNewsflashData,
  LikeAction,
  PostLikesResponse,
  NewsflashFeedResponse,
  UserPostsResponse,
} from '../types/newsflash';
import { errorService } from './errorService';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Add any auth headers if needed in the future
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error: AxiosError) => {
        const apiError = this.handleError(error);
        errorService.logError(apiError);
        return Promise.reject(apiError);
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const serverError = error.response.data as any;
      return {
        code: error.response.status,
        message: serverError.message || error.message,
        errors: serverError.errors || [],
        timestamp: new Date().toISOString(),
      };
    } else if (error.request) {
      // Network error
      return {
        code: 0,
        message: 'Network error. Please check your connection.',
        errors: [],
        timestamp: new Date().toISOString(),
      };
    } else {
      // Other error
      return {
        code: -1,
        message: error.message || 'An unexpected error occurred',
        errors: [],
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Authentication endpoints
  async login(userData: CreateUserData): Promise<ApiResponse<User>> {
    return this.client.post('/api/login', userData);
  }

  async checkUserExists(
    email: string
  ): Promise<ApiResponse<{ exists: boolean; email: string }>> {
    return this.client.post('/api/users/check', { email });
  }

  // User endpoints
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    return this.client.get(`/api/users/${userId}`);
  }

  async getFollowers(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<
    ApiResponse<
      UsersListResponse & {
        followers: User[];
        pagination: {
          page: number;
          limit: number;
          totalFollowers: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }
    >
  > {
    return this.client.get(`/api/users/${userId}/followers`, {
      params: { page, limit },
    });
  }

  async getFollowing(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<
    ApiResponse<
      UsersListResponse & {
        following: User[];
        pagination: {
          page: number;
          limit: number;
          totalFollowing: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }
    >
  > {
    return this.client.get(`/api/users/${userId}/following`, {
      params: { page, limit },
    });
  }

  async toggleFollow(
    targetUserId: string,
    currentUserId: string
  ): Promise<ApiResponse<FollowAction>> {
    return this.client.post(`/api/users/${targetUserId}/follow`, {
      userId: currentUserId,
    });
  }

  async getFollowStatus(
    targetUserId: string,
    currentUserId: string
  ): Promise<ApiResponse<UserFollowStatus>> {
    return this.client.get(`/api/users/${targetUserId}/follow-status`, {
      params: { userId: currentUserId },
    });
  }

  // Posts/Newsflash endpoints
  async getAllPosts(
    page = 1,
    limit = 20
  ): Promise<ApiResponse<NewsflashFeedResponse>> {
    return this.client.get('/api/posts', {
      params: { page, limit },
    });
  }

  async getUserPosts(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<UserPostsResponse>> {
    return this.client.get(`/api/posts/${userId}`, {
      params: { page, limit },
    });
  }

  async createPost(
    postData: CreateNewsflashData
  ): Promise<ApiResponse<Newsflash>> {
    return this.client.post('/api/posts', postData);
  }

  async updatePost(
    postId: string,
    postData: UpdateNewsflashData
  ): Promise<ApiResponse<Newsflash>> {
    return this.client.put(`/api/posts/${postId}`, postData);
  }

  async deletePost(postId: string): Promise<
    ApiResponse<{
      id: string;
      deletedAt: string;
    }>
  > {
    return this.client.delete(`/api/posts/${postId}`);
  }

  async getPost(postId: string): Promise<ApiResponse<Newsflash>> {
    return this.client.get(`/api/posts/single/${postId}`);
  }

  // Like functionality
  async toggleLike(
    postId: string,
    userId: string
  ): Promise<ApiResponse<LikeAction>> {
    return this.client.post(`/api/posts/${postId}/like`, { userId });
  }

  async getPostLikes(postId: string): Promise<ApiResponse<PostLikesResponse>> {
    return this.client.get(`/api/posts/${postId}/likes`);
  }

  // Health check
  async healthCheck(): Promise<
    ApiResponse<{
      status: string;
      environment: string;
      timestamp: string;
      uptime: number;
      version: string;
    }>
  > {
    return this.client.get('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
