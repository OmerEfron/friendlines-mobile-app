import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Newsflash, CreateNewsflashData, AuthUser } from '@/types';
import { apiService, ApiError } from '@/services/api';
import { useNotification } from './useNotification';

// Fetch newsflashes with API service
const fetchNewsflashes = async (currentUserId: string): Promise<Newsflash[]> => {
  try {
    return await apiService.getPosts(1, 20, currentUserId);
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
    queryKey: ['newsflashes', currentUser.id],
    queryFn: () => fetchNewsflashes(currentUser.id),
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
        generate: data.generate, // Pass through the generate parameter
        audienceType: data.audienceType,
        targetFriendId: data.targetFriendId || null, // Explicitly set to null if not provided
        ...(data.tone && { tone: data.tone }),
        ...(data.length && { length: data.length }),
        ...(data.temperature && { temperature: data.temperature }),
      };
      
      console.log('📝 Creating post with data:', JSON.stringify(postData, null, 2));
      
      const response = await apiService.createPost(postData);
      
      console.log('✅ Create post API response:', JSON.stringify(response, null, 2));
      
      return response;
    },
    onSuccess: (newPost) => {
      // Update query cache by adding new post to the beginning
      queryClient.setQueryData(['newsflashes', currentUser.id], (old: Newsflash[] = []) => [
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