import React from 'react';
import { render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomeScreen from '../../screens/HomeScreen';
import * as useNewsflashesHook from '../../hooks/useNewsflashes';
import * as useMockDataHook from '../../hooks/useMockData';

// Mock the hooks
jest.mock('../../hooks/useNewsflashes');
jest.mock('../../hooks/useMockData');
jest.mock('../../components', () => ({
  NewsflashCard: ({ newsflash }: any) => (
    require('react-native').Text({ testID: `newsflash-${newsflash.id}` }, newsflash.headline)
  ),
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

describe('HomeScreen', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock useMockData hook
    (useMockDataHook.useMockData as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      friends: [],
      groups: [],
    });

    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  describe('Header Section', () => {
    it('renders the app title and subtitle', () => {
      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes: [],
        isLoading: false,
        error: null,
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      const { getByText } = render(
        <HomeScreen />,
        { wrapper }
      );

      expect(getByText('Friendlines')).toBeTruthy();
      expect(getByText('Because friendships deserve headlines')).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('shows loading message when loading', () => {
      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes: [],
        isLoading: true,
        error: null,
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      const { getByText } = render(
        <HomeScreen />,
        { wrapper }
      );

      expect(getByText('Loading newsflashes...')).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('shows error message when there is an error', () => {
      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes: [],
        isLoading: false,
        error: new Error('Network error'),
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      const { getByText } = render(
        <HomeScreen />,
        { wrapper }
      );

      expect(getByText('Failed to load newsflashes')).toBeTruthy();
    });
  });

  describe('Empty State', () => {
    it('shows empty message when no newsflashes', () => {
      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes: [],
        isLoading: false,
        error: null,
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      const { getByText } = render(
        <HomeScreen />,
        { wrapper }
      );

      expect(getByText('No newsflashes yet. Create your first one!')).toBeTruthy();
    });
  });

  describe('Newsflashes Display', () => {
    it('renders newsflashes when available', () => {
      const newsflashes = [
        mockNewsflash,
        {
          ...mockNewsflash,
          id: 'newsflash-2',
          headline: 'Another Achievement',
        },
      ];

      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes,
        isLoading: false,
        error: null,
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      const { getByTestId } = render(
        <HomeScreen />,
        { wrapper }
      );

      expect(getByTestId('newsflash-newsflash-1')).toBeTruthy();
      expect(getByTestId('newsflash-newsflash-2')).toBeTruthy();
    });

    it('renders correct number of newsflashes', () => {
      const newsflashes = [mockNewsflash];

      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes,
        isLoading: false,
        error: null,
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      const { getByTestId, queryByText } = render(
        <HomeScreen />,
        { wrapper }
      );

      expect(getByTestId('newsflash-newsflash-1')).toBeTruthy();
      expect(queryByText('No newsflashes yet. Create your first one!')).toBeNull();
    });
  });

  describe('State Priorities', () => {
    it('shows loading over error', () => {
      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes: [],
        isLoading: true,
        error: new Error('Network error'),
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      const { getByText, queryByText } = render(
        <HomeScreen />,
        { wrapper }
      );

      expect(getByText('Loading newsflashes...')).toBeTruthy();
      expect(queryByText('Failed to load newsflashes')).toBeNull();
    });

    it('shows error over empty state', () => {
      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes: [],
        isLoading: false,
        error: new Error('Network error'),
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      const { getByText, queryByText } = render(
        <HomeScreen />,
        { wrapper }
      );

      expect(getByText('Failed to load newsflashes')).toBeTruthy();
      expect(queryByText('No newsflashes yet. Create your first one!')).toBeNull();
    });
  });

  describe('ScrollView Behavior', () => {
    it('renders ScrollView with correct props', () => {
      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes: [mockNewsflash],
        isLoading: false,
        error: null,
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      const { UNSAFE_getByType } = render(
        <HomeScreen />,
        { wrapper }
      );

      const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
    });
  });

  describe('Hook Integration', () => {
    it('calls useNewsflashes with current user', () => {
      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes: [],
        isLoading: false,
        error: null,
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      render(<HomeScreen />, { wrapper });

      expect(useNewsflashesHook.useNewsflashes).toHaveBeenCalledWith(mockUser);
    });

    it('calls useMockData hook', () => {
      (useNewsflashesHook.useNewsflashes as jest.Mock).mockReturnValue({
        newsflashes: [],
        isLoading: false,
        error: null,
        createNewsflash: jest.fn(),
        refetch: jest.fn(),
      });

      render(<HomeScreen />, { wrapper });

      expect(useMockDataHook.useMockData).toHaveBeenCalled();
    });
  });
}); 