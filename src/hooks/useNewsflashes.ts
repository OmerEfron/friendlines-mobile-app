import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Newsflash, CreateNewsflashData, AuthUser } from '@/types';
import { apiService, ApiError } from '@/services/api';
import { useNotification } from './useNotification';

// Fetch newsflashes with API service
const fetchNewsflashes = async (): Promise<Newsflash[]> => {
  try {
    return await apiService.getPosts();
  } catch (error) {
    console.error('Failed to fetch newsflashes:', error);
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

export const useNewsflashes = (currentUser: AuthUser): UseNewsflashesReturn => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  
  // Query for fetching newsflashes
  const {
    data: newsflashes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['newsflashes'],
    queryFn: fetchNewsflashes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for creating newsflashes
  const createMutation = useMutation({
    mutationFn: async (data: CreateNewsflashData) => {
      // Prepare data for API - use rawText instead of originalText and add userId
      const postData: CreateNewsflashData = {
        originalText: data.originalText,
        rawText: data.originalText, // API uses rawText
        recipients: data.recipients,
        groups: data.groups,
        groupIds: data.groups, // API uses groupIds instead of groups
        userId: currentUser.id, // API requires userId
      };
      
      return await apiService.createPost(postData);
    },
    onSuccess: (newPost) => {
      // Update query cache by adding new post to the beginning
      queryClient.setQueryData(['newsflashes'], (old: Newsflash[] = []) => [
        newPost,
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
        'Failed to Create Newsflash',
        'Something went wrong. Please try again.'
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