import 'expo-dev-client';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/contexts/AppContext';
import { QueryProvider } from './src/contexts/QueryProvider';
import { NotificationProvider } from './src/contexts/NotificationContext';
import NotificationBanner from './src/components/NotificationBanner';

// Enable react-native-screens
enableScreens();

export default function App(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AppProvider>
          <NotificationProvider>
            <AppNavigator />
            <NotificationBanner />
            <StatusBar style="auto" />
          </NotificationProvider>
        </AppProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
