export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface Friend {
  id: string;
  user: User;
  status: 'pending' | 'accepted';
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdBy: string;
  createdAt: Date;
}

export interface Newsflash {
  id: string;
  originalText: string;
  transformedText: string;
  headline: string;
  author: User;
  recipients: string[];
  groups: string[];
  createdAt: Date;
  sentiment?: 'playful' | 'proud' | 'nostalgic' | 'neutral';
}

export interface CreateNewsflashData {
  originalText: string;
  recipients: string[];
  groups: string[];
}

// Mobile-specific navigation types
export type RootTabParamList = {
  Home: undefined;
  Create: undefined;
  Profile: { userId?: string };
};

export type RootStackParamList = {
  MainTabs: undefined;
  NewsflashDetail: { newsflashId: string };
  UserProfile: { userId: string };
  Settings: undefined;
};