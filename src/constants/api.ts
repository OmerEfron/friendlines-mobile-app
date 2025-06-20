export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/login',
  CHECK_USER: '/api/users/check',

  // Users
  USERS: '/api/users',
  USER_PROFILE: (userId: string) => `/api/users/${userId}`,
  USER_FOLLOWERS: (userId: string) => `/api/users/${userId}/followers`,
  USER_FOLLOWING: (userId: string) => `/api/users/${userId}/following`,
  USER_FOLLOW: (userId: string) => `/api/users/${userId}/follow`,
  USER_FOLLOW_STATUS: (userId: string) => `/api/users/${userId}/follow-status`,

  // Posts/Newsflashes
  POSTS: '/api/posts',
  USER_POSTS: (userId: string) => `/api/posts/${userId}`,
  POST_DETAIL: (postId: string) => `/api/posts/single/${postId}`,
  POST_UPDATE: (postId: string) => `/api/posts/${postId}`,
  POST_DELETE: (postId: string) => `/api/posts/${postId}`,
  POST_LIKE: (postId: string) => `/api/posts/${postId}/like`,
  POST_LIKES: (postId: string) => `/api/posts/${postId}/likes`,

  // Health
  HEALTH: '/health',
} as const;

export const API_CONFIG = {
  TIMEOUT: 10000,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
