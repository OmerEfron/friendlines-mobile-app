import type { Newsflash, User, Friend, Group } from '@/types';

// Newsflash utilities
export const sortNewsflashesByDate = (newsflashes: Newsflash[]): Newsflash[] => {
  return [...newsflashes].sort((a, b) => 
    new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime()
  );
};

export const filterNewsflashesByUser = (newsflashes: Newsflash[], userId: string): Newsflash[] => {
  return newsflashes.filter(newsflash => newsflash.author?.id === userId);
};

export const filterNewsflashesBySentiment = (
  newsflashes: Newsflash[], 
  sentiment: Newsflash['sentiment']
): Newsflash[] => {
  return newsflashes.filter(newsflash => newsflash.sentiment === sentiment);
};

export const getNewsflashesForUser = (
  newsflashes: Newsflash[], 
  currentUser: User,
  friends: Friend[]
): Newsflash[] => {
  const friendIds = friends
    .filter(friend => friend.status === 'accepted')
    .map(friend => friend.user.id);
  
  return newsflashes.filter(newsflash => {
    // Show own newsflashes
    if (newsflash.author?.id === currentUser.id) return true;
    
    // Show newsflashes from friends
    if (newsflash.author?.id && friendIds.includes(newsflash.author.id)) return true;
    
    // Show newsflashes where user is a recipient
    if (newsflash.recipients?.includes(currentUser.id)) return true;
    
    return false;
  });
};

// Friend utilities
export const getAcceptedFriends = (friends: Friend[]): Friend[] => {
  return friends.filter(friend => friend.status === 'accepted');
};

export const getPendingFriends = (friends: Friend[]): Friend[] => {
  return friends.filter(friend => friend.status === 'pending');
};

export const sortFriendsByName = (friends: Friend[]): Friend[] => {
  return [...friends].sort((a, b) => a.user.name.localeCompare(b.user.name));
};

// Group utilities
export const sortGroupsByName = (groups: Group[]): Group[] => {
  return [...groups].sort((a, b) => a.name.localeCompare(b.name));
};

export const getGroupsForUser = (groups: Group[], userId: string): Group[] => {
  return groups.filter(group => 
    group.createdBy === userId || 
    group.members.some(member => member.id === userId)
  );
};

export const getUsersInGroup = (group: Group): User[] => {
  return group.members;
};

// Search utilities
export const searchNewsflashes = (newsflashes: Newsflash[], query: string): Newsflash[] => {
  const lowerQuery = query.toLowerCase();
  return newsflashes.filter(newsflash =>
    (newsflash.headline?.toLowerCase().includes(lowerQuery)) ||
    (newsflash.transformedText?.toLowerCase().includes(lowerQuery)) ||
    (newsflash.originalText?.toLowerCase().includes(lowerQuery)) ||
    (newsflash.author?.name.toLowerCase().includes(lowerQuery))
  );
};

export const searchFriends = (friends: Friend[], query: string): Friend[] => {
  const lowerQuery = query.toLowerCase();
  return friends.filter(friend =>
    friend.user.name.toLowerCase().includes(lowerQuery) ||
    friend.user.email.toLowerCase().includes(lowerQuery)
  );
};

export const searchGroups = (groups: Group[], query: string): Group[] => {
  const lowerQuery = query.toLowerCase();
  return groups.filter(group =>
    group.name.toLowerCase().includes(lowerQuery) ||
    (group.description && group.description.toLowerCase().includes(lowerQuery))
  );
};

// Validation utilities
export const validateNewsflashData = (data: Partial<Newsflash>): string[] => {
  const errors: string[] = [];
  
  if (!data.originalText || data.originalText.trim().length === 0) {
    errors.push('Original text is required');
  }
  
  if (data.originalText && data.originalText.length > 500) {
    errors.push('Original text must be less than 500 characters');
  }
  
  if (!data.recipients || data.recipients.length === 0) {
    errors.push('At least one recipient is required');
  }
  
  return errors;
};

// Helper to generate random IDs
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
}; 