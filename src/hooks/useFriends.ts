import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, FriendshipStatus } from '@/types';
import { apiService, ApiError } from '@/services/api';
import { useNotification } from './useNotification';

interface UseFriendsReturn {
  friends: User[];
  friendRequests: User[];
  sentRequests: User[];
  isLoading: boolean;
  error: Error | null;
  sendFriendRequest: (targetUserId: string) => Promise<void>;
  acceptFriendRequest: (requesterUserId: string) => Promise<void>;
  rejectFriendRequest: (requesterUserId: string) => Promise<void>;
  cancelFriendRequest: (targetUserId: string) => Promise<void>;
  unfriend: (friendUserId: string) => Promise<void>;
  refetchFriends: () => void;
  getFriendshipStatus: (targetUserId: string) => Promise<FriendshipStatus>;
}

export const useFriends = (userId: string): UseFriendsReturn => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  // Query for friends list
  const {
    data: friendsData,
    isLoading: friendsLoading,
    error: friendsError,
    refetch: refetchFriends
  } = useQuery({
    queryKey: ['friends', userId],
    queryFn: () => apiService.getFriends(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query for received friend requests
  const {
    data: receivedRequestsData,
    isLoading: receivedLoading,
    error: receivedError,
  } = useQuery({
    queryKey: ['friendRequests', userId, 'received'],
    queryFn: () => apiService.getFriendRequests(userId, 'received'),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Query for sent friend requests
  const {
    data: sentRequestsData,
    isLoading: sentLoading,
    error: sentError,
  } = useQuery({
    queryKey: ['friendRequests', userId, 'sent'],
    queryFn: () => apiService.getFriendRequests(userId, 'sent'),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      return await apiService.sendFriendRequest(targetUserId);
    },
    onSuccess: (data) => {
      // Update sent requests cache
      queryClient.invalidateQueries({ queryKey: ['friendRequests', userId, 'sent'] });
      showSuccess('Friend Request Sent', 'Your friend request has been sent successfully.');
    },
    onError: (error: any) => {
      console.error('Failed to send friend request:', error);
      // Try to extract the specific error message from the API response
      const errorMessage = error?.message || 'Failed to send friend request. Please try again.';
      showError('Error', errorMessage);
    },
  });

  // Accept friend request mutation
  const acceptRequestMutation = useMutation({
    mutationFn: async (requesterUserId: string) => {
      return await apiService.acceptFriendRequest(requesterUserId);
    },
    onSuccess: (data) => {
      // Update all friend-related caches
      queryClient.invalidateQueries({ queryKey: ['friends', userId] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests', userId, 'received'] });
      showSuccess('Friend Request Accepted', 'You are now friends!');
    },
    onError: (error: any) => {
      console.error('Failed to accept friend request:', error);
      const errorMessage = error?.message || 'Failed to accept friend request. Please try again.';
      showError('Error', errorMessage);
    },
  });

  // Reject friend request mutation
  const rejectRequestMutation = useMutation({
    mutationFn: async (requesterUserId: string) => {
      return await apiService.rejectFriendRequest(requesterUserId);
    },
    onSuccess: (data) => {
      // Update received requests cache
      queryClient.invalidateQueries({ queryKey: ['friendRequests', userId, 'received'] });
      showSuccess('Friend Request Rejected', 'Friend request has been rejected.');
    },
    onError: (error: any) => {
      console.error('Failed to reject friend request:', error);
      const errorMessage = error?.message || 'Failed to reject friend request. Please try again.';
      showError('Error', errorMessage);
    },
  });

  // Cancel friend request mutation
  const cancelRequestMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      return await apiService.cancelFriendRequest(targetUserId);
    },
    onSuccess: (data) => {
      // Update sent requests cache
      queryClient.invalidateQueries({ queryKey: ['friendRequests', userId, 'sent'] });
      showSuccess('Request Canceled', 'Friend request has been canceled.');
    },
    onError: (error: any) => {
      console.error('Failed to cancel friend request:', error);
      const errorMessage = error?.message || 'Failed to cancel friend request. Please try again.';
      showError('Error', errorMessage);
    },
  });

  // Unfriend mutation
  const unfriendMutation = useMutation({
    mutationFn: async (friendUserId: string) => {
      return await apiService.unfriend(friendUserId);
    },
    onSuccess: (data) => {
      // Update friends cache
      queryClient.invalidateQueries({ queryKey: ['friends', userId] });
      showSuccess('Unfriended', 'Friend has been removed from your friends list.');
    },
    onError: (error: any) => {
      console.error('Failed to unfriend:', error);
      const errorMessage = error?.message || 'Failed to unfriend. Please try again.';
      showError('Error', errorMessage);
    },
  });

  // Get friendship status function
  const getFriendshipStatus = useCallback(async (targetUserId: string): Promise<FriendshipStatus> => {
    try {
      return await apiService.getFriendshipStatus(targetUserId);
    } catch (error) {
      console.error('Failed to get friendship status:', error);
      throw error;
    }
  }, []);

  // Callback functions
  const sendFriendRequest = useCallback(async (targetUserId: string) => {
    await sendRequestMutation.mutateAsync(targetUserId);
  }, [sendRequestMutation]);

  const acceptFriendRequest = useCallback(async (requesterUserId: string) => {
    await acceptRequestMutation.mutateAsync(requesterUserId);
  }, [acceptRequestMutation]);

  const rejectFriendRequest = useCallback(async (requesterUserId: string) => {
    await rejectRequestMutation.mutateAsync(requesterUserId);
  }, [rejectRequestMutation]);

  const cancelFriendRequest = useCallback(async (targetUserId: string) => {
    await cancelRequestMutation.mutateAsync(targetUserId);
  }, [cancelRequestMutation]);

  const unfriend = useCallback(async (friendUserId: string) => {
    await unfriendMutation.mutateAsync(friendUserId);
  }, [unfriendMutation]);

  return {
    friends: friendsData?.friends || [],
    friendRequests: receivedRequestsData?.requests || [],
    sentRequests: sentRequestsData?.requests || [],
    isLoading: friendsLoading || receivedLoading || sentLoading || 
               sendRequestMutation.isPending || acceptRequestMutation.isPending || 
               rejectRequestMutation.isPending || cancelRequestMutation.isPending || 
               unfriendMutation.isPending,
    error: friendsError || receivedError || sentError || 
           sendRequestMutation.error || acceptRequestMutation.error || 
           rejectRequestMutation.error || cancelRequestMutation.error || 
           unfriendMutation.error,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    unfriend,
    refetchFriends,
    getFriendshipStatus,
  };
}; 