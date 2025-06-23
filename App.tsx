import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/contexts/AppContext';
import { QueryProvider } from './src/contexts/QueryProvider';

export default function App(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AppProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AppProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
