import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '../components';
import { theme } from '../styles/theme';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { LoginData } from '../types';

const LoginScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Check if full name has at least two words
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length < 2) {
      Alert.alert('Error', 'Please enter your first and last name');
      return false;
    }

    return true;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const loginData: LoginData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
      };

      const user = await apiService.login(loginData);
      await login(user);
      
      Alert.alert('Success', 'Welcome to Friendlines!');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed', 
        'Failed to login. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Friendlines</Text>
          <Text style={styles.subtitle}>Because friendships deserve headlines</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            style={styles.textInput}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            placeholder="john@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />

          <Button
            title={isLoading ? 'Signing In...' : 'Get Started'}
            onPress={handleLogin}
            disabled={isLoading}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            No passwords needed! We'll create your account automatically.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen; 