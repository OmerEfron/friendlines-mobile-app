import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useNewsflashes } from '../../hooks/useNewsflashes';
import { apiService } from '../../services/api';
import * as notificationHook from '../../hooks/useNotification';

// Mock the API service
jest.mock('../../services/api', () => ({
  apiService: {
    getNewsflashes: jest.fn(),
    transformText: jest.fn(),
  },
  ApiError: jest.fn(),
}));

// Mock the notification hook
jest.mock('../../hooks/useNotification', () => ({
  useNotification: jest.fn(),
}));

// Mock utils
jest.mock('../../utils', () => ({
  generateId: jest.fn(() => 'mock-id'),
}));

const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

const mockNewsflash = {
  id: 'newsflash-1',
  originalText: 'I just finished a marathon!',
  transformedText: 'Local runner completes marathon challenge',
  headline: 'Marathon Achievement',
  author: mockUser,
  recipients: ['user-2'],
  groups: ['running-group'],
  createdAt: new Date('2023-01-01'),
  sentiment: 'proud' as const,
};

const mockNotification = {
  showSuccess: jest.fn(),
  showError: jest.fn(),
};

describe('useNewsflashes Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    
    jest.clearAllMocks();
    
    (notificationHook.useNotification as jest.Mock).mockReturnValue(mockNotification);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  describe('Fetching Newsflashes', () => {
    it('fetches newsflashes successfully', async () => {
      (apiService.getNewsflashes as jest.Mock).mockResolvedValue([mockNewsflash]);

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.newsflashes).toEqual([mockNewsflash]);
      expect(result.current.error).toBe(null);
      expect(apiService.getNewsflashes).toHaveBeenCalledWith(mockUser.id);
    });

    it('handles fetch error gracefully', async () => {
      const mockError = new Error('Network error');
      (apiService.getNewsflashes as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.newsflashes).toEqual([]);
      expect(result.current.error).toBeTruthy();
    });

    it('returns empty array when API is not available', async () => {
      const apiError = { statusCode: 0 };
      (apiService.getNewsflashes as jest.Mock).mockRejectedValue(apiError);

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.newsflashes).toEqual([]);
    });
  });

  const createData = {
    originalText: 'I just got a new job!',
    recipients: ['user-2', 'user-3'],
    groups: ['work-friends'],
  };

  describe('Creating Newsflashes', () => {

    it('creates newsflash successfully with API', async () => {
      (apiService.getNewsflashes as jest.Mock).mockResolvedValue([]);
      (apiService.transformText as jest.Mock).mockResolvedValue({
        headline: 'Career Milestone Achieved',
        transformedText: 'Individual successfully obtained new employment',
        sentiment: 'proud',
      });

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.createNewsflash(createData);

      expect(apiService.transformText).toHaveBeenCalledWith(createData.originalText);
      expect(mockNotification.showSuccess).toHaveBeenCalledWith(
        'Newsflash Created! 🎉',
        'Your update has been transformed and shared.'
      );
    });

    it('creates newsflash with mock transformation when API fails', async () => {
      (apiService.getNewsflashes as jest.Mock).mockResolvedValue([]);
      (apiService.transformText as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.createNewsflash(createData);

      expect(mockNotification.showSuccess).toHaveBeenCalledWith(
        'Newsflash Created! 🎉',
        'Your update has been transformed and shared.'
      );
    });

    it('shows error when creation fails completely', async () => {
      (apiService.getNewsflashes as jest.Mock).mockResolvedValue([]);
      (apiService.transformText as jest.Mock).mockRejectedValue(new Error('API Error'));

      // Mock generateId to throw an error to simulate complete failure
      const mockGenerateId = require('../../utils').generateId;
      mockGenerateId.mockImplementation(() => {
        throw new Error('ID generation failed');
      });

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.createNewsflash(createData)).rejects.toThrow();
    });
  });

  describe('Mock Transformation Logic', () => {
    it('transforms marathon text correctly', async () => {
      (apiService.getNewsflashes as jest.Mock).mockResolvedValue([]);
      (apiService.transformText as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const marathonData = {
        originalText: 'I just finished a marathon!',
        recipients: ['user-2'],
        groups: ['running'],
      };

      await result.current.createNewsflash(marathonData);

      expect(mockNotification.showSuccess).toHaveBeenCalled();
    });

    it('transforms job text correctly', async () => {
      (apiService.getNewsflashes as jest.Mock).mockResolvedValue([]);
      (apiService.transformText as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const jobData = {
        originalText: 'I got a new job at Google!',
        recipients: ['user-2'],
        groups: ['work'],
      };

      await result.current.createNewsflash(jobData);

      expect(mockNotification.showSuccess).toHaveBeenCalled();
    });
  });

  describe('Cache Management', () => {
    it('updates cache correctly when creating newsflash', async () => {
      (apiService.getNewsflashes as jest.Mock).mockResolvedValue([mockNewsflash]);
      (apiService.transformText as jest.Mock).mockResolvedValue({
        headline: 'New Achievement',
        transformedText: 'Someone accomplished something',
        sentiment: 'neutral',
      });

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.newsflashes).toEqual([mockNewsflash]);
      });

      await result.current.createNewsflash(createData);

      // Check that new newsflash was added to the beginning of the array
      expect(result.current.newsflashes.length).toBe(2);
      expect(result.current.newsflashes[0].originalText).toBe(createData.originalText);
    });
  });

  describe('Refetch Functionality', () => {
    it('provides refetch function', async () => {
      (apiService.getNewsflashes as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(
        () => useNewsflashes(mockUser),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.refetch).toBe('function');
    });
  });
}); 