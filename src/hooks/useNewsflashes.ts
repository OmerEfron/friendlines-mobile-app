import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Newsflash, CreateNewsflashData, User } from '@/types';
import { apiService, ApiError } from '@/services/api';
import { useNotification } from './useNotification';
import { generateId } from '@/utils';

// Mock AI transformation function (fallback when API is not available)
const mockTransformToNewsflash = async (text: string): Promise<{ headline: string; transformedText: string; sentiment: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple transformation logic (in real app, this would call OpenAI API)
  const sentiments = ['playful', 'proud', 'nostalgic', 'neutral'];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  
  // Basic transformation patterns
  const patterns = [
    { 
      trigger: 'marathon', 
      headline: 'Local Runner Completes Marathon Challenge', 
      transform: (t: string) => t.replace(/I (just|recently)?\s*/, 'This person ').replace(/my/, 'their') 
    },
    { 
      trigger: 'job', 
      headline: 'Career Milestone Achieved', 
      transform: (t: string) => t.replace(/I (got|landed|started)/, 'Individual successfully obtained').replace(/my/, 'their') 
    },
    { 
      trigger: 'graduation', 
      headline: 'Academic Achievement Unlocked', 
      transform: (t: string) => t.replace(/I (graduated|finished)/, 'Student successfully completed').replace(/my/, 'their') 
    },
  ];
  
  const matchedPattern = patterns.find(p => text.toLowerCase().includes(p.trigger));
  
  if (matchedPattern) {
    return {
      headline: matchedPattern.headline,
      transformedText: matchedPattern.transform(text),
      sentiment
    };
  }
  
  // Default transformation
  const transformed = text
    .replace(/^I\s+/, 'This individual ')
    .replace(/\bI\b/g, 'they')
    .replace(/\bme\b/g, 'them')
    .replace(/\bmy\b/g, 'their')
    .replace(/\bmine\b/g, 'theirs');
    
  return {
    headline: 'Breaking: Personal Update',
    transformedText: transformed,
    sentiment
  };
};

// Fetch newsflashes with API service
const fetchNewsflashes = async (userId: string): Promise<Newsflash[]> => {
  try {
    return await apiService.getNewsflashes(userId);
  } catch (error) {
    // For development, return mock data when API is not available
    if (error instanceof ApiError && error.statusCode === 0) {
      console.log('API not available, using mock data');
      return [];
    }
    throw error;
  }
};

interface UseNewsflashesReturn {
  newsflashes: Newsflash[];
  isLoading: boolean;
  error: Error | null;
  createNewsflash: (data: CreateNewsflashData) => Promise<void>;
  refetch: () => void;
}

export const useNewsflashes = (currentUser: User): UseNewsflashesReturn => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  
  // Query for fetching newsflashes
  const {
    data: newsflashes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['newsflashes', currentUser.id],
    queryFn: () => fetchNewsflashes(currentUser.id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for creating newsflashes
  const createMutation = useMutation({
    mutationFn: async (data: CreateNewsflashData) => {
      let headline: string, transformedText: string, sentiment: string;
      
      try {
        // Try to use API service for AI transformation
        const result = await apiService.transformText(data.originalText);
        headline = result.headline;
        transformedText = result.transformedText;
        sentiment = result.sentiment;
      } catch (error) {
        // Fallback to mock transformation when API is not available
        console.log('AI API not available, using mock transformation');
        const result = await mockTransformToNewsflash(data.originalText);
        headline = result.headline;
        transformedText = result.transformedText;
        sentiment = result.sentiment;
      }
      
      const newNewsflash: Newsflash = {
        id: generateId(),
        originalText: data.originalText,
        transformedText,
        headline,
        author: currentUser,
        recipients: data.recipients,
        groups: data.groups,
        createdAt: new Date(),
        sentiment: sentiment as Newsflash['sentiment']
      };
      
      return newNewsflash;
    },
    onSuccess: (newNewsflash) => {
      // Update the query cache
      queryClient.setQueryData(['newsflashes', currentUser.id], (old: Newsflash[] = []) => [
        newNewsflash,
        ...old
      ]);
      
      showSuccess(
        'Newsflash Created! 🎉',
        'Your update has been transformed and shared.'
      );
    },
    onError: (error) => {
      console.error('Failed to create newsflash:', error);
      showError(
        'Error',
        'Failed to create newsflash. Please try again.'
      );
    },
  });

  const createNewsflash = useCallback(async (data: CreateNewsflashData) => {
    await createMutation.mutateAsync(data);
  }, [createMutation]);

  return {
    newsflashes,
    isLoading: isLoading || createMutation.isPending,
    error: error || createMutation.error,
    createNewsflash,
    refetch,
  };
}; 