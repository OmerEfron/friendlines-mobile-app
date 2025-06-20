export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  followersCount: number;
  followingCount: number;
}

export interface CreateUserData {
  fullName: string;
  email: string;
}

export interface UserFollowStatus {
  targetUserId: string;
  targetUserName: string;
  currentUserId: string;
  currentUserName: string;
  isFollowing: boolean;
  isFollowedBy: boolean;
  mutualFollow: boolean;
}

export interface FollowAction {
  targetUserId: string;
  currentUserId: string;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  action: 'followed' | 'unfollowed';
}

export interface UsersListResponse {
  userId: string;
  userName: string;
  followersCount?: number;
  followingCount?: number;
  followers?: User[];
  following?: User[];
}
