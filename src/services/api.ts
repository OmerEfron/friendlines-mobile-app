import Constants from 'expo-constants';
import type { Newsflash, CreateNewsflashData, User, LoginData, AuthUser, Friend, FriendshipStatus, Group, GroupsResponse, NotificationData } from '@/types';

// Get API URL from app config
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://localhost:3000';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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

      console.log('🌐 API Request:', {
        url,
        method: config.method || 'GET',
        body: config.body,
        headers: config.headers
      });

      const response = await fetch(url, config);
      
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      console.log('✅ API Success Response:', data);
      return data;
    } catch (error) {
      console.error('💥 API Request Failed:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // Authentication API methods
  async login(loginData: LoginData): Promise<AuthUser> {
    const response = await this.request<AuthUser>('/api/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    return response.data;
  }

  async checkUser(email: string): Promise<{ exists: boolean; email: string }> {
    const response = await this.request<{ exists: boolean; email: string }>('/api/users/check', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response.data;
  }

  // User API methods
  async getUser(id: string): Promise<AuthUser> {
    const response = await this.request<AuthUser>(`/api/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<AuthUser> {
    const response = await this.request<AuthUser>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  // Push Notifications API methods
  async registerPushToken(userId: string, expoPushToken: string): Promise<{ userId: string; tokenRegistered: boolean; updatedAt: string }> {
    const response = await this.request<{ userId: string; tokenRegistered: boolean; updatedAt: string }>(`/api/users/${userId}/push-token`, {
      method: 'POST',
      body: JSON.stringify({ expoPushToken }),
    });
    return response.data;
  }

  // Friendship API methods
  async sendFriendRequest(targetUserId: string, currentUserId: string): Promise<{ targetUserId: string; currentUserId: string; requestSent: boolean }> {
    const response = await this.request<{ targetUserId: string; currentUserId: string; requestSent: boolean }>(`/api/users/${targetUserId}/friend-request`, {
      method: 'POST',
      body: JSON.stringify({ userId: currentUserId }),
    });
    return response.data;
  }

  async acceptFriendRequest(requesterUserId: string, currentUserId: string): Promise<{ requesterUserId: string; currentUserId: string; areFriends: boolean; friendsCount: number }> {
    const response = await this.request<{ requesterUserId: string; currentUserId: string; areFriends: boolean; friendsCount: number }>(`/api/users/${requesterUserId}/accept-friend`, {
      method: 'POST',
      body: JSON.stringify({ userId: currentUserId }),
    });
    return response.data;
  }

  async rejectFriendRequest(requesterUserId: string, currentUserId: string): Promise<{ requesterUserId: string; currentUserId: string; requestRejected: boolean }> {
    const response = await this.request<{ requesterUserId: string; currentUserId: string; requestRejected: boolean }>(`/api/users/${requesterUserId}/reject-friend`, {
      method: 'POST',
      body: JSON.stringify({ userId: currentUserId }),
    });
    return response.data;
  }

  async cancelFriendRequest(targetUserId: string, currentUserId: string): Promise<{ targetUserId: string; currentUserId: string; requestCanceled: boolean }> {
    const response = await this.request<{ targetUserId: string; currentUserId: string; requestCanceled: boolean }>(`/api/users/${targetUserId}/cancel-friend-request`, {
      method: 'POST',
      body: JSON.stringify({ userId: currentUserId }),
    });
    return response.data;
  }

  async unfriend(friendUserId: string, currentUserId: string): Promise<{ friendUserId: string; currentUserId: string; areFriends: boolean; friendsCount: number }> {
    const response = await this.request<{ friendUserId: string; currentUserId: string; areFriends: boolean; friendsCount: number }>(`/api/users/${friendUserId}/unfriend`, {
      method: 'POST',
      body: JSON.stringify({ userId: currentUserId }),
    });
    return response.data;
  }

  async getFriends(userId: string, page: number = 1, limit: number = 20): Promise<{ userId: string; userName: string; friendsCount: number; friends: User[] }> {
    const response = await this.request<{ userId: string; userName: string; friendsCount: number; friends: User[] }>(`/api/users/${userId}/friends?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getFriendRequests(userId: string, type: 'received' | 'sent' = 'received', page: number = 1, limit: number = 20): Promise<{ userId: string; userName: string; requestsCount: number; requestType: string; requests: User[] }> {
    const response = await this.request<{ userId: string; userName: string; requestsCount: number; requestType: string; requests: User[] }>(`/api/users/${userId}/friend-requests?type=${type}&page=${page}&limit=${limit}`);
    return response.data;
  }

  async getFriendshipStatus(targetUserId: string, currentUserId: string): Promise<FriendshipStatus> {
    const response = await this.request<FriendshipStatus>(`/api/users/${targetUserId}/friendship-status?userId=${currentUserId}`);
    return response.data;
  }

  // Groups API methods
  async createGroup(userId: string, groupData: { name: string; description?: string }): Promise<Group> {
    const response = await this.request<Group>(`/api/groups/${userId}`, {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
    return response.data;
  }

  async inviteToGroup(groupId: string, userIds: string[], currentUserId: string): Promise<{ groupId: string; invitedUsers: string[]; pendingInvites: number }> {
    const response = await this.request<{ groupId: string; invitedUsers: string[]; pendingInvites: number }>(`/api/groups/${groupId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ userIds, userId: currentUserId }),
    });
    return response.data;
  }

  async acceptGroupInvitation(groupId: string, userId: string): Promise<{ groupId: string; userId: string; memberCount: number }> {
    const response = await this.request<{ groupId: string; userId: string; memberCount: number }>(`/api/groups/${groupId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    return response.data;
  }

  async leaveGroup(groupId: string, userId: string): Promise<{ groupId: string; userId: string; remainingMembers: number }> {
    const response = await this.request<{ groupId: string; userId: string; remainingMembers: number }>(`/api/groups/${groupId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    return response.data;
  }

  async getGroup(groupId: string, userId?: string): Promise<Group> {
    const queryParam = userId ? `?userId=${userId}` : '';
    const response = await this.request<Group>(`/api/groups/${groupId}${queryParam}`);
    return response.data;
  }

  async getUserGroups(userId: string): Promise<GroupsResponse> {
    const response = await this.request<GroupsResponse>(`/api/groups/user/${userId}`);
    return response.data;
  }

  // Posts API methods (matching the API documentation)
  async getPosts(page: number = 1, limit: number = 20, currentUserId?: string): Promise<Newsflash[]> {
    if (currentUserId) {
      // Use the general posts endpoint with currentUserId as query param and includeFriends=true
      const endpoint = `/api/posts?page=${page}&limit=${limit}&currentUserId=${currentUserId}&includeFriends=true`;
      const response = await this.request<Newsflash[]>(endpoint);
      console.log('response', response.data);
      return response.data;
    } else {
      // Fallback to general posts endpoint for backward compatibility
      const endpoint = `/api/posts?page=${page}&limit=${limit}`;
      const response = await this.request<Newsflash[]>(endpoint);
      return response.data;
    }
  }

  async getUserPosts(userId: string, page: number = 1, limit: number = 20, currentUserId?: string): Promise<Newsflash[]> {
    let endpoint = `/api/posts/${userId}?page=${page}&limit=${limit}`;
    if (currentUserId) {
      endpoint += `&currentUserId=${currentUserId}`;
    }
    const response = await this.request<Newsflash[]>(endpoint);
    return response.data;
  }

  async createPost(data: CreateNewsflashData): Promise<Newsflash> {
    const response = await this.request<Newsflash>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async generateNewsflash(data: { rawText: string; userId: string; tone?: string; length?: 'short' | 'long'; temperature?: number }): Promise<{ rawText: string; generatedText: string; method: string; user: { id: string; fullName: string }; options: any }> {
    const response = await this.request<{ rawText: string; generatedText: string; method: string; user: { id: string; fullName: string }; options: any }>('/api/posts/generate-newsflash', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getPost(id: string): Promise<Newsflash> {
    const response = await this.request<Newsflash>(`/api/posts/single/${id}`);
    return response.data;
  }

  async updatePost(id: string, data: { rawText: string }): Promise<Newsflash> {
    const response = await this.request<Newsflash>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    await this.request<void>(`/api/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Legacy methods for backward compatibility (will map to new endpoints)
  async getNewsflashes(userId: string): Promise<Newsflash[]> {
    // Get all posts instead of user-specific ones for the feed
    return this.getPosts(1, 20, userId);
  }

  async createNewsflash(data: CreateNewsflashData): Promise<Newsflash> {
    return this.createPost(data);
  }

  async getNewsflash(id: string): Promise<Newsflash> {
    return this.getPost(id);
  }

  async deleteNewsflash(id: string): Promise<void> {
    return this.deletePost(id);
  }

  // AI transformation API (removed as the API handles this automatically)
  async transformText(text: string): Promise<{ headline: string; transformedText: string; sentiment: string }> {
    // This endpoint doesn't exist in the API - transformation happens automatically during post creation
    throw new ApiError('Text transformation is handled automatically during post creation', 404);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export { ApiError };
export type { ApiResponse }; 