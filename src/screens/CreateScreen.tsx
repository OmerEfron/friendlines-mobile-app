import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Input, Button, Badge } from '../components';
import { theme } from '../styles/theme';
import { useNewsflashes } from '../hooks/useNewsflashes';
import { useMockData } from '../hooks/useMockData';

const CreateScreen: React.FC = () => {
  const [originalText, setOriginalText] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [shareWithAllFriends, setShareWithAllFriends] = useState(false);

  const { currentUser, friends, groups } = useMockData();
  const { createNewsflash, isLoading } = useNewsflashes(currentUser);

  const handleSubmit = async (): Promise<void> => {
    if (!originalText.trim()) {
      Alert.alert('Error', 'Please enter some text to create a newsflash');
      return;
    }

    try {
      await createNewsflash({
        originalText,
        recipients: shareWithAllFriends ? friends.map(f => f.user.id) : selectedFriends,
        groups: selectedGroups,
      });
      
      // Reset form
      setOriginalText('');
      setSelectedFriends([]);
      setSelectedGroups([]);
      setShareWithAllFriends(false);
      
      Alert.alert('Success', 'Newsflash created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create newsflash. Please try again.');
    }
  };

  const toggleFriend = (friendId: string): void => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const toggleGroup = (groupId: string): void => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleAllFriends = (): void => {
    setShareWithAllFriends(prev => !prev);
    if (!shareWithAllFriends) {
      setSelectedFriends([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Newsflash</Text>
        <Text style={styles.subtitle}>Transform your update into a headline</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="What's happening in your life?"
          placeholder="e.g., 'I just finished my first marathon!'"
          value={originalText}
          onChangeText={setOriginalText}
          multiline
          numberOfLines={6}
          maxLength={500}
          style={styles.textInput}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share with:</Text>
          <View style={styles.badgeContainer}>
            <Badge
              selected={shareWithAllFriends}
              onPress={toggleAllFriends}
              variant="outline"
              style={styles.badge}
            >
              All Friends
            </Badge>
          </View>
          
          {!shareWithAllFriends && (
            <View style={styles.badgeContainer}>
              {friends.slice(0, 6).map(friend => (
                <Badge
                  key={friend.user.id}
                  selected={selectedFriends.includes(friend.user.id)}
                  onPress={() => toggleFriend(friend.user.id)}
                  variant="outline"
                  style={styles.badge}
                >
                  {friend.user.name}
                </Badge>
              ))}
            </View>
          )}
        </View>

        {groups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Groups:</Text>
            <View style={styles.badgeContainer}>
              {groups.map(group => (
                <Badge
                  key={group.id}
                  selected={selectedGroups.includes(group.id)}
                  onPress={() => toggleGroup(group.id)}
                  variant="outline"
                  style={styles.badge}
                >
                  {group.name}
                </Badge>
              ))}
            </View>
          </View>
        )}

        <Button
          title={isLoading ? 'Creating...' : '✨ Create Newsflash'}
          onPress={handleSubmit}
          disabled={!originalText.trim() || isLoading}
          loading={isLoading}
          fullWidth
          style={styles.submitButton}
        />
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
  textInput: {
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  badge: {
    marginHorizontal: theme.spacing.xs / 2,
    marginBottom: theme.spacing.xs,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
});

export default CreateScreen; 