import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NewsflashCard } from '../components';
import { theme } from '../styles/theme';
import { useNewsflashes } from '../hooks/useNewsflashes';
import { useAppContext } from '../contexts/AppContext';

const HomeScreen: React.FC = () => {
  const { user } = useAppContext();
  
  // If user is null, this shouldn't happen since we have authentication guards
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Authentication error</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { newsflashes, isLoading, error } = useNewsflashes(user);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friendlines</Text>
        <Text style={styles.subtitle}>Because friendships deserve headlines</Text>
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <Text style={styles.placeholder}>Loading newsflashes...</Text>
        )}
        
        {error && (
          <Text style={styles.errorText}>Failed to load newsflashes</Text>
        )}
        
        {!isLoading && !error && newsflashes.length === 0 && (
          <Text style={styles.placeholder}>
            No newsflashes yet. Create your first one!
          </Text>
        )}
        
        {newsflashes.map((newsflash) => (
          <NewsflashCard key={newsflash.id} newsflash={newsflash} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  placeholder: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error ?? '#ff4444',
    textAlign: 'center',
  },
});

export default HomeScreen; 