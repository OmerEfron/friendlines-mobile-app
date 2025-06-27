import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, View, Text, StyleSheet } from 'react-native';

import { theme } from '../styles/theme';
import { useAppContext } from '../contexts/AppContext';
import type { RootStackParamList } from '../types';
import NotificationManager from '../components/NotificationManager';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CreateScreen from '../screens/CreateScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FriendsScreen from '../screens/FriendsScreen';
import GroupsScreen from '../screens/GroupsScreen';
import GroupFeedsScreen from '../screens/GroupFeedsScreen';
import UserFeedScreen from '../screens/UserFeedScreen';
import NewsflashDetailScreen from '../screens/NewsflashDetailScreen';
import MenuScreen from '../screens/MenuScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AuthenticatedNavigator: React.FC = () => {
  console.log('📚 AuthenticatedNavigator rendering with detachInactiveScreens=false');
  
  return (
    <Stack.Navigator
      detachInactiveScreens={false}
      initialRouteName="MainFeed"
      screenOptions={{
        headerShown: false, // We'll use our custom NewsHeader
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="MainFeed" 
        component={HomeScreen}
        options={{ 
          title: 'Main Feed',
        }}
      />
      <Stack.Screen 
        name="GroupFeeds" 
        component={GroupFeedsScreen}
        options={{ 
          title: 'Group Feeds',
        }}
      />
      <Stack.Screen 
        name="UserFeed" 
        component={UserFeedScreen}
        options={{ 
          title: 'User Feed',
        }}
      />
      <Stack.Screen 
        name="CreateNewsflash" 
        component={CreateScreen}
        options={{ 
          title: 'Create Newsflash',
        }}
      />
      <Stack.Screen 
        name="NewsflashDetail" 
        component={NewsflashDetailScreen}
        options={{ 
          title: 'Newsflash Detail',
        }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={ProfileScreen}
        options={{ 
          title: 'User Profile',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
        }}
      />
      <Stack.Screen 
        name="FriendProfile" 
        component={ProfileScreen}
        options={{ 
          title: 'Friend Profile',
        }}
      />
      <Stack.Screen 
        name="GroupDetail" 
        component={GroupsScreen} // TODO: Create GroupDetailScreen
        options={{ 
          title: 'Group Detail',
        }}
      />
      <Stack.Screen 
        name="CreateGroup" 
        component={GroupsScreen} // TODO: Create CreateGroupScreen
        options={{ 
          title: 'Create Group',
        }}
      />
      <Stack.Screen 
        name="ManageGroup" 
        component={GroupsScreen} // TODO: Create ManageGroupScreen
        options={{ 
          title: 'Manage Group',
        }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ 
          title: 'Search',
        }}
      />
      <Stack.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{ 
          title: 'Menu',
        }}
      />
    </Stack.Navigator>
  );
};

const UnauthenticatedNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAppContext();

  if (isInitializing) {
    return (
      <NavigationContainer>
        <NotificationManager />
        <LoadingScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <NotificationManager />
      {isAuthenticated ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});

export default AppNavigator; 