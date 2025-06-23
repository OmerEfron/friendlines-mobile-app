import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, Text, StyleSheet } from 'react-native';

import { theme } from '../styles/theme';
import { useAppContext } from '../contexts/AppContext';
import type { RootTabParamList, RootStackParamList } from '../types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CreateScreen from '../screens/CreateScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import FriendsScreen from '../screens/FriendsScreen';
import GroupsScreen from '../screens/GroupsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator: React.FC = () => {
  console.log('📱 TabNavigator rendering with detachInactiveScreens=false');
  
  return (
    <Tab.Navigator
      detachInactiveScreens={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Create':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Friends':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Groups':
              iconName = focused ? 'people-circle' : 'people-circle-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateScreen}
        options={{ 
          tabBarLabel: 'Create',
          tabBarAccessibilityLabel: 'Create newsflash tab',
        }}
      />
      <Tab.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{ 
          tabBarLabel: 'Friends',
          tabBarAccessibilityLabel: 'Friends tab',
        }}
      />
      <Tab.Screen 
        name="Groups" 
        component={GroupsScreen}
        options={{ 
          tabBarLabel: 'Groups',
          tabBarAccessibilityLabel: 'Groups tab',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tab.Navigator>
  );
};

const AuthenticatedNavigator: React.FC = () => {
  console.log('📚 AuthenticatedNavigator rendering with detachInactiveScreens=false');
  
  return (
    <Stack.Navigator
      detachInactiveScreens={false}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      {/* Additional stack screens can be added here */}
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
        <LoadingScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
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