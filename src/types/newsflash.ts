export interface Newsflash {
  id: string;
  userId: string;
  userFullName: string;
  rawText: string;
  generatedText: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

export interface CreateNewsflashData {
  rawText: string;
  userId: string;
}

export interface UpdateNewsflashData {
  rawText: string;
}

export interface LikeAction {
  postId: string;
  userId: string;
  isLiked: boolean;
  likesCount: number;
  action: 'liked' | 'unliked';
}

export interface PostLike {
  userId: string;
  fullName: string;
  email: string;
}

export interface PostLikesResponse {
  postId: string;
  likesCount: number;
  likes: PostLike[];
}

export interface NewsflashFeedResponse {
  data: Newsflash[];
  pagination: {
    page: number;
    limit: number;
    totalPosts: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UserPostsResponse extends NewsflashFeedResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}
