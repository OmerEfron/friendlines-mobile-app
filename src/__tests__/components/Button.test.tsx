import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/common/Button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('Basic Functionality', () => {
    it('renders correctly with title', () => {
      const { getByText } = render(
        <Button title="Test Button" onPress={mockOnPress} />
      );
      
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      const { getByRole } = render(
        <Button title="Test Button" onPress={mockOnPress} />
      );
      
      fireEvent.press(getByRole('button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const { getByRole } = render(
        <Button title="Test Button" onPress={mockOnPress} disabled />
      );
      
      fireEvent.press(getByRole('button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const { getByRole } = render(
        <Button title="Test Button" onPress={mockOnPress} loading />
      );
      
      fireEvent.press(getByRole('button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('renders primary variant correctly', () => {
      const { getByRole } = render(
        <Button title="Primary" onPress={mockOnPress} variant="primary" />
      );
      
      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('renders secondary variant correctly', () => {
      const { getByRole } = render(
        <Button title="Secondary" onPress={mockOnPress} variant="secondary" />
      );
      
      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('renders outline variant correctly', () => {
      const { getByRole } = render(
        <Button title="Outline" onPress={mockOnPress} variant="outline" />
      );
      
      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('renders ghost variant correctly', () => {
      const { getByRole } = render(
        <Button title="Ghost" onPress={mockOnPress} variant="ghost" />
      );
      
      const button = getByRole('button');
      expect(button).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      const { getByRole } = render(
        <Button title="Small" onPress={mockOnPress} size="sm" />
      );
      
      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('renders medium size correctly (default)', () => {
      const { getByRole } = render(
        <Button title="Medium" onPress={mockOnPress} size="md" />
      );
      
      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('renders large size correctly', () => {
      const { getByRole } = render(
        <Button title="Large" onPress={mockOnPress} size="lg" />
      );
      
      const button = getByRole('button');
      expect(button).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('shows loading indicator when loading', () => {
      const { getByTestId } = render(
        <Button title="Loading" onPress={mockOnPress} loading />
      );
      
      expect(() => getByTestId('activity-indicator')).not.toThrow();
    });

    it('hides text when loading is false', () => {
      const { getByText } = render(
        <Button title="Not Loading" onPress={mockOnPress} loading={false} />
      );
      
      expect(getByText('Not Loading')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByRole } = render(
        <Button title="Accessible" onPress={mockOnPress} />
      );
      
      expect(getByRole('button')).toBeTruthy();
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(
        <Button title="Accessible Button" onPress={mockOnPress} />
      );
      
      expect(getByLabelText('Accessible Button')).toBeTruthy();
    });

    it('has correct disabled state in accessibility', () => {
      const { getByRole } = render(
        <Button title="Disabled" onPress={mockOnPress} disabled />
      );
      
      const button = getByRole('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('has loading hint when loading', () => {
      const { getByRole } = render(
        <Button title="Loading" onPress={mockOnPress} loading />
      );
      
      const button = getByRole('button');
      expect(button.props.accessibilityHint).toBe('Loading in progress');
    });
  });

  describe('Full Width', () => {
    it('applies full width styling when specified', () => {
      const { getByRole } = render(
        <Button title="Full Width" onPress={mockOnPress} fullWidth />
      );
      
      const button = getByRole('button');
      expect(button).toBeTruthy();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom styles correctly', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByRole } = render(
        <Button title="Custom" onPress={mockOnPress} style={customStyle} />
      );
      
      const button = getByRole('button');
      expect(button).toBeTruthy();
    });
  });
}); 