import Constants from 'expo-constants';
import type { Newsflash, CreateNewsflashData, User, LoginData, AuthUser, Friend, FriendshipStatus, Group, GroupsResponse, NotificationData } from '@/types';

// Get API URL from app config
// const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://192.168.1.132:3000';
// const API_BASE_URL = 'https://friendlines-production.up.railway.app';
// const API_BASE_URL = 'http://77.127.184.234:3000';
const API_BASE_URL = 'http://192.168.1.132:3000';

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
  private authToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      };

      // Add Authorization header if token is available
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const config: RequestInit = {
        headers,
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
  async login(loginData: LoginData): Promise<AuthUser & { token?: string }> {
    const response = await this.request<AuthUser & { token?: string }>('/api/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    
    // Extract token from root level of response (backend sends token at root, not in data)
    const token = (response as any).token;
    console.log('🔑 API Service: Token extraction - token found:', !!token);
    
    // Store the token if provided
    if (token) {
      this.setAuthToken(token);
      console.log('🔑 API Service: Token stored in API service');
    } else {
      console.warn('⚠️ API Service: No token received from backend');
    }
    
    // Return user data with token included
    const result = {
      ...response.data,
      token: token
    };
    
    console.log('🔑 API Service: Returning user data with token included:', !!result.token);
    return result;
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

  async updateUser(userData: Partial<User>): Promise<AuthUser> {
    const response = await this.request<AuthUser>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  // Push Notifications API methods
  async registerPushToken(expoPushToken: string): Promise<{ userId: string; tokenRegistered: boolean; updatedAt: string }> {
    const response = await this.request<{ userId: string; tokenRegistered: boolean; updatedAt: string }>('/api/push-token', {
      method: 'POST',
      body: JSON.stringify({ expoPushToken }),
    });
    return response.data;
  }

  // Friendship API methods - Updated to use new social endpoints with authentication
  async sendFriendRequest(targetUserId: string): Promise<{ targetUserId: string; currentUserId: string; requestSent: boolean }> {
    const response = await this.request<{ targetUserId: string; currentUserId: string; requestSent: boolean }>(`/api/social/users/${targetUserId}/friend-request`, {
      method: 'POST',
    });
    return response.data;
  }

  async acceptFriendRequest(requesterUserId: string): Promise<{ requesterId: string; requesterName: string; accepterId: string; accepterName: string; acceptedAt: string }> {
    const response = await this.request<{ requesterId: string; requesterName: string; accepterId: string; accepterName: string; acceptedAt: string }>(`/api/social/users/${requesterUserId}/accept-friend`, {
      method: 'POST',
    });
    return response.data;
  }

  async rejectFriendRequest(requesterUserId: string): Promise<{ requesterId: string; requesterName: string; rejecterId: string; rejecterName: string }> {
    const response = await this.request<{ requesterId: string; requesterName: string; rejecterId: string; rejecterName: string }>(`/api/social/users/${requesterUserId}/reject-friend`, {
      method: 'POST',
    });
    return response.data;
  }

  async cancelFriendRequest(targetUserId: string): Promise<{ targetId: string; targetName: string; senderId: string; senderName: string }> {
    const response = await this.request<{ targetId: string; targetName: string; senderId: string; senderName: string }>(`/api/social/users/${targetUserId}/cancel-friend-request`, {
      method: 'POST',
    });
    return response.data;
  }

  async unfriend(friendUserId: string): Promise<{ friendId: string; friendName: string; userId: string; userName: string }> {
    const response = await this.request<{ friendId: string; friendName: string; userId: string; userName: string }>(`/api/social/users/${friendUserId}/friendship`, {
      method: 'DELETE',
    });
    return response.data;
  }

  async getFriends(userId: string, page: number = 1, limit: number = 20): Promise<{ userId: string; userName: string; friendsCount: number; friends: User[] }> {
    const response = await this.request<User[]>(`/api/social/users/${userId}/friends?page=${page}&limit=${limit}`);
    
    // Transform backend response to match frontend expectations
    // Backend returns friends array directly in data, but frontend expects object with friends property
    const user = await this.getUser(userId);
    return {
      userId: userId,
      userName: user.fullName || 'Unknown User',
      friendsCount: response.data.length,
      friends: response.data
    };
  }

  async getFriendRequests(userId: string, type: 'received' | 'sent' = 'received', page: number = 1, limit: number = 20): Promise<{ userId: string; userName: string; requestsCount: number; requestType: string; requests: User[] }> {
    const response = await this.request<User[]>(`/api/social/users/${userId}/friend-requests?type=${type}&page=${page}&limit=${limit}`);
    
    // Transform backend response to match frontend expectations
    // Backend returns requests array directly in data, but frontend expects object with requests property
    const user = await this.getUser(userId);
    return {
      userId: userId,
      userName: user.fullName || 'Unknown User',
      requestsCount: response.data.length,
      requestType: type,
      requests: response.data
    };
  }

  async getFriendshipStatus(targetUserId: string): Promise<FriendshipStatus> {
    const response = await this.request<FriendshipStatus>(`/api/social/users/${targetUserId}/friendship-status`);
    return response.data;
  }

  // Groups API methods
  async createGroup(groupData: { name: string; description?: string }): Promise<Group> {
    const response = await this.request<Group>('/api/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
    return response.data;
  }

  async inviteToGroup(groupId: string, userIds: string[]): Promise<{ groupId: string; invitedUsers: string[]; pendingInvites: number }> {
    const response = await this.request<{ groupId: string; invitedUsers: string[]; pendingInvites: number }>(`/api/groups/${groupId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
    return response.data;
  }

  async acceptGroupInvitation(groupId: string): Promise<{ groupId: string; userId: string; memberCount: number }> {
    const response = await this.request<{ groupId: string; userId: string; memberCount: number }>(`/api/groups/${groupId}/accept`, {
      method: 'POST',
    });
    return response.data;
  }

  async leaveGroup(groupId: string): Promise<{ groupId: string; userId: string; remainingMembers: number }> {
    const response = await this.request<{ groupId: string; userId: string; remainingMembers: number }>(`/api/groups/${groupId}/leave`, {
      method: 'POST',
    });
    return response.data;
  }

  async getGroup(groupId: string): Promise<Group> {
    const response = await this.request<Group>(`/api/groups/${groupId}`);
    return response.data;
  }

  async getUserGroups(userId: string): Promise<GroupsResponse> {
    const response = await this.request<Group[]>(`/api/groups/user/${userId}`);
    
    // Transform backend response to match frontend expectations
    // Backend returns flat array of groups, but frontend expects categorized response
    const groups = response.data;
    
    // Categorize groups based on the user's role
    const owned: Group[] = [];
    const member: Group[] = [];
    const invited: Group[] = [];
    
    groups.forEach(group => {
      if (group.ownerId === userId) {
        owned.push(group);
      } else if ((group as any).role === 'member') {
        member.push(group);
      } else if ((group as any).role === 'invited') {
        invited.push(group);
      } else {
        // Default to member if role is not specified
        member.push(group);
      }
    });
    
    return {
      owned,
      member,
      invited
    };
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

  async createPost(data: Omit<CreateNewsflashData, 'userId'>): Promise<Newsflash> {
    const response = await this.request<Newsflash>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async generateNewsflash(data: { rawText: string; tone?: string; length?: 'short' | 'long'; temperature?: number }): Promise<{ rawText: string; generatedText: string; method: string; user: { id: string; fullName: string }; options: any }> {
    const response = await this.request<{ rawText: string; generatedText: string; method: string; user: { id: string; fullName: string }; options: any }>('/api/posts/preview', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getPost(id: string): Promise<Newsflash> {
    const response = await this.request<Newsflash>(`/api/posts/${id}/details`);
    return response.data;
  }

  async updatePost(id: string, data: { rawText: string }): Promise<Newsflash> {
    const response = await this.request<Newsflash>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ rawText: data.rawText }),
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

  async createNewsflash(data: Omit<CreateNewsflashData, 'userId'>): Promise<Newsflash> {
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