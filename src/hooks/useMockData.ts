import { useState } from 'react';
import type { User, Friend, Group } from '@/types';

export const useMockData = () => {
  const [currentUser] = useState<User>({
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex@friendlines.com',
    avatar: undefined
  });

  const [friends] = useState<Friend[]>([
    {
      id: 'friend-1',
      user: { id: 'user-2', name: 'Sarah Chen', email: 'sarah@example.com' },
      status: 'accepted',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'friend-2', 
      user: { id: 'user-3', name: 'Mike Rodriguez', email: 'mike@example.com' },
      status: 'accepted',
      createdAt: new Date('2024-01-10')
    },
    {
      id: 'friend-3',
      user: { id: 'user-4', name: 'Emily Davis', email: 'emily@example.com' },
      status: 'pending',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 'friend-4',
      user: { id: 'user-5', name: 'David Kim', email: 'david@example.com' },
      status: 'accepted', 
      createdAt: new Date('2024-01-08')
    },
    {
      id: 'friend-5',
      user: { id: 'user-6', name: 'Lisa Wang', email: 'lisa@example.com' },
      status: 'accepted',
      createdAt: new Date('2024-01-12')
    }
  ]);

  const [groups] = useState<Group[]>([
    {
      id: 'group-1',
      name: 'College Friends',
      description: 'Friends from university',
      members: [
        { id: 'user-2', name: 'Sarah Chen', email: 'sarah@example.com' },
        { id: 'user-3', name: 'Mike Rodriguez', email: 'mike@example.com' }
      ],
      createdBy: 'user-1',
      createdAt: new Date('2024-01-05')
    },
    {
      id: 'group-2',
      name: 'Work Team',
      description: 'Colleagues and work friends',
      members: [
        { id: 'user-5', name: 'David Kim', email: 'david@example.com' },
        { id: 'user-6', name: 'Lisa Wang', email: 'lisa@example.com' }
      ],
      createdBy: 'user-1',
      createdAt: new Date('2024-01-03')
    },
    {
      id: 'group-3',
      name: 'Running Club',
      description: 'Local running enthusiasts',
      members: [
        { id: 'user-2', name: 'Sarah Chen', email: 'sarah@example.com' },
        { id: 'user-5', name: 'David Kim', email: 'david@example.com' }
      ],
      createdBy: 'user-1',
      createdAt: new Date('2024-01-01')
    }
  ]);

  return {
    currentUser,
    friends,
    groups
  };
}; 