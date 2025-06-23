import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NewsflashCard } from '../components';
import { theme } from '../styles/theme';
import { useNewsflashes } from '../hooks/useNewsflashes';
import { useMockData } from '../hooks/useMockData';

const HomeScreen: React.FC = () => {
  const { currentUser } = useMockData();
  const { newsflashes, isLoading, error } = useNewsflashes(currentUser);

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
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});

export default HomeScreen; 