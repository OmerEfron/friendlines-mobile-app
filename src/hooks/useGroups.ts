import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Group, GroupsResponse } from '@/types';
import { apiService, ApiError } from '@/services/api';
import { useNotification } from './useNotification';

interface UseGroupsReturn {
  ownedGroups: Group[];
  memberGroups: Group[];
  invitedGroups: Group[];
  isLoading: boolean;
  error: Error | null;
  createGroup: (groupData: { name: string; description?: string }) => Promise<Group>;
  inviteToGroup: (groupId: string, userIds: string[]) => Promise<void>;
  acceptGroupInvitation: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  getGroup: (groupId: string) => Promise<Group>;
  refetchGroups: () => void;
}

export const useGroups = (userId: string): UseGroupsReturn => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  // Query for user's groups
  const {
    data: groupsData,
    isLoading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups
  } = useQuery({
    queryKey: ['groups', userId],
    queryFn: () => apiService.getUserGroups(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: { name: string; description?: string }) => {
      return await apiService.createGroup(userId, groupData);
    },
    onSuccess: (newGroup) => {
      // Update groups cache
      queryClient.setQueryData(['groups', userId], (old: GroupsResponse | undefined) => {
        if (!old) return { owned: [newGroup], member: [], invited: [] };
        return {
          ...old,
          owned: [newGroup, ...old.owned]
        };
      });
      showSuccess('Group Created', `Group "${newGroup.name}" has been created successfully.`);
    },
    onError: (error) => {
      console.error('Failed to create group:', error);
      showError('Error', 'Failed to create group. Please try again.');
    },
  });

  // Invite to group mutation
  const inviteToGroupMutation = useMutation({
    mutationFn: async ({ groupId, userIds }: { groupId: string; userIds: string[] }) => {
      return await apiService.inviteToGroup(groupId, userIds, userId);
    },
    onSuccess: (data) => {
      // Invalidate groups cache to refresh pending invites
      queryClient.invalidateQueries({ queryKey: ['groups', userId] });
      showSuccess('Invitations Sent', `${data.invitedUsers.length} invitation(s) sent successfully.`);
    },
    onError: (error) => {
      console.error('Failed to invite to group:', error);
      showError('Error', 'Failed to send invitations. Please try again.');
    },
  });

  // Accept group invitation mutation
  const acceptInvitationMutation = useMutation({
    mutationFn: async (groupId: string) => {
      return await apiService.acceptGroupInvitation(groupId, userId);
    },
    onSuccess: (data) => {
      // Update groups cache
      queryClient.invalidateQueries({ queryKey: ['groups', userId] });
      showSuccess('Invitation Accepted', 'You have joined the group successfully!');
    },
    onError: (error) => {
      console.error('Failed to accept group invitation:', error);
      showError('Error', 'Failed to accept invitation. Please try again.');
    },
  });

  // Leave group mutation
  const leaveGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      return await apiService.leaveGroup(groupId, userId);
    },
    onSuccess: (data) => {
      // Update groups cache
      queryClient.invalidateQueries({ queryKey: ['groups', userId] });
      showSuccess('Left Group', 'You have left the group successfully.');
    },
    onError: (error) => {
      console.error('Failed to leave group:', error);
      showError('Error', 'Failed to leave group. Please try again.');
    },
  });

  // Get group details function
  const getGroup = useCallback(async (groupId: string): Promise<Group> => {
    try {
      return await apiService.getGroup(groupId, userId);
    } catch (error) {
      console.error('Failed to get group:', error);
      throw error;
    }
  }, [userId]);

  // Callback functions
  const createGroup = useCallback(async (groupData: { name: string; description?: string }): Promise<Group> => {
    return await createGroupMutation.mutateAsync(groupData);
  }, [createGroupMutation]);

  const inviteToGroup = useCallback(async (groupId: string, userIds: string[]) => {
    await inviteToGroupMutation.mutateAsync({ groupId, userIds });
  }, [inviteToGroupMutation]);

  const acceptGroupInvitation = useCallback(async (groupId: string) => {
    await acceptInvitationMutation.mutateAsync(groupId);
  }, [acceptInvitationMutation]);

  const leaveGroup = useCallback(async (groupId: string) => {
    await leaveGroupMutation.mutateAsync(groupId);
  }, [leaveGroupMutation]);

  return {
    ownedGroups: groupsData?.owned || [],
    memberGroups: groupsData?.member || [],
    invitedGroups: groupsData?.invited || [],
    isLoading: groupsLoading || 
               createGroupMutation.isPending || 
               inviteToGroupMutation.isPending || 
               acceptInvitationMutation.isPending || 
               leaveGroupMutation.isPending,
    error: groupsError || 
           createGroupMutation.error || 
           inviteToGroupMutation.error || 
           acceptInvitationMutation.error || 
           leaveGroupMutation.error,
    createGroup,
    inviteToGroup,
    acceptGroupInvitation,
    leaveGroup,
    getGroup,
    refetchGroups,
  };
}; 