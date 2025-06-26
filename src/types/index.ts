export interface User {
  id: string;
  name: string;
  fullName?: string;
  avatar?: string;
  email: string;
  followersCount?: number;
  followingCount?: number;
  friendsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  // Friendship system fields
  friends?: string[];
  friendRequests?: string[];
  sentFriendRequests?: string[];
  // Push notification field
  expoPushToken?: string;
}

export interface Friend {
  id: string;
  user: User;
  status: 'pending' | 'accepted' | 'request_sent' | 'request_received';
  createdAt: Date;
}

export interface FriendshipStatus {
  targetUserId: string;
  targetUserName: string;
  currentUserId: string;
  currentUserName: string;
  status: 'none' | 'friends' | 'request_sent' | 'request_received';
  areFriends: boolean;
  requestSent: boolean;
  requestReceived: boolean;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdBy: string;
  ownerId?: string;
  invites?: string[];
  memberCount?: number;
  createdAt: Date;
  updatedAt?: Date;
  settings?: {
    postNotifications: boolean;
    membershipNotifications: boolean;
  };
}

export interface GroupsResponse {
  owned: Group[];
  member: Group[];
  invited: Group[];
}

export interface Newsflash {
  id: string;
  originalText?: string;
  transformedText?: string;
  generatedText?: string;
  headline?: string;
  rawText?: string;
  author?: User;
  userId?: string;
  userFullName?: string;
  recipients?: string[];
  groups?: string[];
  groupIds?: string[];
  createdAt?: Date;
  timestamp?: string;
  updatedAt?: string;
  sentiment?: 'playful' | 'proud' | 'nostalgic' | 'neutral';
  // Post audience targeting fields
  audienceType?: 'friends' | 'friend' | 'groups' | 'public';
  targetFriendId?: string | null;
  visibility?: 'friends_only' | 'friend_only' | 'groups_only' | 'public';
  // API response fields
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
}

export interface CreateNewsflashData {
  originalText: string;
  rawText?: string;
  recipients: string[];
  groups: string[];
  groupIds?: string[];
  userId?: string;
  // New audience targeting fields
  audienceType?: 'friends' | 'friend' | 'groups';
  targetFriendId?: string | null;
  tone?: string;
  length?: 'short' | 'long';
  temperature?: number;
  // Generate field for controlling newsflash generation
  generate?: boolean;
}

// Authentication types
export interface LoginData {
  fullName: string;
  email: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  followersCount: number;
  followingCount: number;
  friendsCount?: number;
  friends?: string[];
  friendRequests?: string[];
  sentFriendRequests?: string[];
  expoPushToken?: string;
}

// Mobile-specific navigation types
export type RootStackParamList = {
  MainFeed: undefined;
  GroupFeeds: undefined;
  UserFeed: { userId?: string };
  CreateNewsflash: undefined;
  NewsflashDetail: { newsflashId: string };
  UserProfile: { userId: string };
  Settings: undefined;
  Login: undefined;
  Register: undefined;
  FriendProfile: { userId: string };
  GroupDetail: { groupId: string };
  CreateGroup: undefined;
  ManageGroup: { groupId: string };
  Search: undefined;
  Menu: undefined;
};

// Legacy tab types (keeping for backward compatibility)
export type RootTabParamList = {
  Home: undefined;
  Create: undefined;
  Profile: { userId?: string };
  Friends: undefined;
  Groups: undefined;
};

// Notification types
export interface NotificationData {
  type: 'new_post' | 'friend_request' | 'friend_accepted' | 'group_invite' | 'group_post';
  postId?: string;
  userId?: string;
  userFullName?: string;
  groupId?: string;
  groupName?: string;
  timestamp: string;
}