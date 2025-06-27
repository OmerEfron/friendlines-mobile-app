// Common utility functions for Friendlines mobile app

export * from './storage';
export * from './data';

// Date formatting utilities
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTimeAgo = (date: Date | string): string => {
  if (!date) return 'unknown';
  
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - targetDate.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(targetDate);
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Platform utilities
export const isIOS = (): boolean => {
  const { Platform } = require('react-native');
  return Platform.OS === 'ios';
};

export const isAndroid = (): boolean => {
  const { Platform } = require('react-native');
  return Platform.OS === 'android';
}; 