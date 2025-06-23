import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Platform } from 'react-native';
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
  multiline = false,
  numberOfLines = 1,
  maxLength,
  autoFocus = false,
  editable = true,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  secureTextEntry = false,
  style,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const hasError = Boolean(error);
  const characterCount = value?.length || 0;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        multiline && styles.multilineContainer,
        isFocused && styles.focused,
        hasError && styles.error,
        !editable && styles.disabled,
      ]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          autoFocus={autoFocus}
          editable={editable}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry}
          accessibilityLabel={label || placeholder}
          accessibilityHint={error ? `Error: ${error}` : undefined}
          accessibilityState={{ disabled: !editable }}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...(Platform.OS === 'ios' && multiline && { textAlignVertical: 'top' })}
        />
      </View>

      <View style={styles.footer}>
        {hasError && (
          <Text style={styles.errorText} accessibilityRole="text">
            {error}
          </Text>
        )}
        
        {maxLength && (
          <Text style={[styles.characterCount, hasError && styles.characterCountError]}>
            {characterCount}/{maxLength}
          </Text>
        )}
      </View>
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
  multilineContainer: {
    minHeight: 100,
  },
  focused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  error: {
    borderColor: theme.colors.error,
  },
  disabled: {
    backgroundColor: theme.colors.surface,
    opacity: 0.6,
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
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm,
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
  characterCount: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  characterCountError: {
    color: theme.colors.error,
  },
}); 