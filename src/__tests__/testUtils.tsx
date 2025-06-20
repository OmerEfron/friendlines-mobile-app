/**
 * Test Utilities
 * Common utilities and helpers for testing React Native components
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';

// Define a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  // In the future, we'll wrap with AuthProvider, ThemeProvider etc.
  return <>{children}</>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };

// Sample test to prevent "no tests" error
describe('Test Utils', () => {
  test('should export render function', () => {
    expect(customRender).toBeDefined();
  });
});
