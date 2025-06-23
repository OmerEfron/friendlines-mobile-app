import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Avatar, Button } from '../components';
import { theme } from '../styles/theme';
import { useAppContext } from '../contexts/AppContext';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAppContext();
  
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

  const handleLogout = (): void => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your Friendlines account</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Avatar
            source={undefined} // AuthUser doesn't have avatar property yet
            fallback={user.fullName}
            size="lg"
            style={styles.avatar}
          />
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            {(user.followersCount !== undefined || user.followingCount !== undefined) && (
              <View style={styles.statsContainer}>
                {user.followersCount !== undefined && (
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{user.followersCount}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </View>
                )}
                {user.followingCount !== undefined && (
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{user.followingCount}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Text style={styles.sectionDescription}>
            Manage your Friendlines account settings
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            style={styles.logoutButton}
          />
        </View>
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
    ...theme.typography.h2,
    color: theme.colors.text,
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
  profileSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...theme.typography.h4,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: theme.spacing.lg,
  },
  logoutButton: {
    marginBottom: theme.spacing.md,
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

export default ProfileScreen; 