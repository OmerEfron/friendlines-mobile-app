/**
 * Jest Setup File
 * This file runs before all tests and sets up the testing environment
 */

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs in tests for cleaner output
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Simple test to verify setup is working
describe('Jest Setup', () => {
  test('should have Jest globals available', () => {
    expect(jest).toBeDefined();
    expect(describe).toBeDefined();
    expect(test).toBeDefined();
    expect(expect).toBeDefined();
  });
});
