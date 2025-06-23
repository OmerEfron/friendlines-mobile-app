import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Card, CardHeader, CardContent, Avatar } from '../components';
import { theme } from '../styles/theme';
import { useMockData } from '../hooks/useMockData';

const ProfileScreen: React.FC = () => {
  const { currentUser, friends, groups } = useMockData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.profileCard}>
          <CardHeader>
            <View style={styles.profileHeader}>
              <Avatar
                source={currentUser.avatar}
                fallback={currentUser.name}
                size="xl"
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{currentUser.name}</Text>
                <Text style={styles.userEmail}>{currentUser.email}</Text>
              </View>
            </View>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Text style={styles.sectionTitle}>Friends</Text>
          </CardHeader>
          <CardContent>
            <Text style={styles.count}>{friends.length} friends</Text>
            <View style={styles.friendsList}>
              {friends.slice(0, 6).map(friend => (
                <View key={friend.user.id} style={styles.friendItem}>
                  <Avatar
                    source={friend.user.avatar}
                    fallback={friend.user.name}
                    size="sm"
                  />
                  <Text style={styles.friendName} numberOfLines={1}>
                    {friend.user.name}
                  </Text>
                </View>
              ))}
              {friends.length > 6 && (
                <View style={styles.friendItem}>
                  <View style={[styles.moreIndicator, { width: 32, height: 32 }]}>
                    <Text style={styles.moreText}>+{friends.length - 6}</Text>
                  </View>
                </View>
              )}
            </View>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Text style={styles.sectionTitle}>Groups</Text>
          </CardHeader>
          <CardContent>
            <Text style={styles.count}>{groups.length} groups</Text>
            {groups.map(group => (
              <View key={group.id} style={styles.groupItem}>
                <View style={styles.groupIndicator} />
                <Text style={styles.groupName}>{group.name}</Text>
              </View>
            ))}
          </CardContent>
        </Card>
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
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
  },
  count: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  friendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  friendItem: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    width: 60,
  },
  friendName: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  moreIndicator: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  moreText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  groupIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  groupName: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});

export default ProfileScreen; 