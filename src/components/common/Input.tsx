import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Keyboard } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { theme } from '../../styles/theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  autoFocus?: boolean;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  style?: any;
  inputStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        hasError && styles.error,
      ]}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>

      {hasError && (
        <View style={styles.footer}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    minHeight: theme.layout.inputHeight,
  },
  focused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  error: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    // Prevent zoom on iOS
    ...(Platform.OS === 'ios' && { fontSize: Math.max(16, theme.typography.body.fontSize) }),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    minHeight: 20,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    flex: 1,
  },
}); 