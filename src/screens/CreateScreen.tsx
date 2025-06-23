import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { Badge } from '../components/common/Badge';
import { theme } from '../styles/theme';
import { useNewsflashes } from '../hooks/useNewsflashes';
import { useFriends } from '../hooks/useFriends';
import { useGroups } from '../hooks/useGroups';
import { useAppContext } from '../contexts/AppContext';
import type { User, Group } from '../types';

type AudienceType = 'friends' | 'friend' | 'groups';

const CreateScreen: React.FC = () => {
  console.log('📝 CreateScreen rendering');
  
  const [originalText, setOriginalText] = useState('');
  const [audienceType, setAudienceType] = useState<AudienceType>('friends');
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const { createNewsflash } = useNewsflashes(user);
  const { friends } = useFriends(user.id);
  const { ownedGroups, memberGroups } = useGroups(user.id);

  // Combine owned and member groups
  const allGroups = [...ownedGroups, ...memberGroups];

  const handleTextChange = (text: string): void => {
    console.log('✏️ CreateScreen text changed:', text.length, 'characters');
    setOriginalText(text);
  };

  const handleAudienceChange = (type: AudienceType) => {
    setAudienceType(type);
    setSelectedFriend(null);
    setSelectedGroups([]);
  };

  const handleFriendSelection = (friend: User) => {
    setSelectedFriend(friend);
  };

  const handleGroupToggle = (group: Group) => {
    setSelectedGroups(prev => {
      const isSelected = prev.some(g => g.id === group.id);
      if (isSelected) {
        return prev.filter(g => g.id !== group.id);
      } else {
        // Limit to 5 groups as per API
        if (prev.length >= 5) {
          Alert.alert('Limit Reached', 'You can select up to 5 groups.');
          return prev;
        }
        return [...prev, group];
      }
    });
  };

  const getAudienceText = () => {
    switch (audienceType) {
      case 'friends':
        return `All your friends (${friends.length})`;
      case 'friend':
        return selectedFriend ? selectedFriend.fullName || selectedFriend.name : 'Select a friend';
      case 'groups':
        return selectedGroups.length > 0 
          ? `${selectedGroups.length} group(s) selected` 
          : 'Select groups';
    }
  };

  const isSubmitDisabled = () => {
    if (!originalText.trim()) return true;
    if (audienceType === 'friend' && !selectedFriend) return true;
    if (audienceType === 'groups' && selectedGroups.length === 0) return true;
    return false;
  };

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitDisabled()) {
      Alert.alert('Error', 'Please complete all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const newsflashData = {
        originalText,
        rawText: originalText,
        userId: user.id,
        audienceType,
        recipients: [], // Legacy field for backward compatibility
        groups: [], // Legacy field for backward compatibility
        ...(audienceType === 'friend' && selectedFriend && {
          targetFriendId: selectedFriend.id
        }),
        ...(audienceType === 'groups' && {
          groupIds: selectedGroups.map(g => g.id)
        })
      };

      await createNewsflash(newsflashData);
      
      // Reset form
      setOriginalText('');
      setAudienceType('friends');
      setSelectedFriend(null);
      setSelectedGroups([]);
      
      Alert.alert('Success', 'Newsflash created successfully!');
    } catch (error) {
      console.error('Failed to create newsflash:', error);
      Alert.alert('Error', 'Failed to create newsflash. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAudienceSelector = () => (
    <View style={styles.audienceSection}>
      <Text style={styles.sectionTitle}>Who can see this?</Text>
      
      <View style={styles.audienceOptions}>
        <TouchableOpacity
          style={[styles.audienceOption, audienceType === 'friends' && styles.selectedOption]}
          onPress={() => handleAudienceChange('friends')}
        >
          <Ionicons name="people" size={20} color={audienceType === 'friends' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.optionText, audienceType === 'friends' && styles.selectedOptionText]}>
            All Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.audienceOption, audienceType === 'friend' && styles.selectedOption]}
          onPress={() => handleAudienceChange('friend')}
        >
          <Ionicons name="person" size={20} color={audienceType === 'friend' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.optionText, audienceType === 'friend' && styles.selectedOptionText]}>
            Specific Friend
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.audienceOption, audienceType === 'groups' && styles.selectedOption]}
          onPress={() => handleAudienceChange('groups')}
        >
          <Ionicons name="people-circle" size={20} color={audienceType === 'groups' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.optionText, audienceType === 'groups' && styles.selectedOptionText]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.audienceText}>{getAudienceText()}</Text>
    </View>
  );

  const renderFriendSelector = () => {
    if (audienceType !== 'friend') return null;

    return (
      <View style={styles.selectionSection}>
        <Text style={styles.sectionTitle}>Select Friend</Text>
        <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
          {friends.map((friend) => (
            <TouchableOpacity
              key={friend.id}
              style={[styles.friendItem, selectedFriend?.id === friend.id && styles.selectedItem]}
              onPress={() => handleFriendSelection(friend)}
            >
              <Text style={[styles.friendName, selectedFriend?.id === friend.id && styles.selectedText]}>
                {friend.fullName || friend.name}
              </Text>
              {selectedFriend?.id === friend.id && (
                <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderGroupSelector = () => {
    if (audienceType !== 'groups') return null;

    return (
      <View style={styles.selectionSection}>
        <Text style={styles.sectionTitle}>Select Groups (max 5)</Text>
        <ScrollView style={styles.groupsList} showsVerticalScrollIndicator={false}>
          {allGroups.map((group) => {
            const isSelected = selectedGroups.some(g => g.id === group.id);
            return (
              <TouchableOpacity
                key={group.id}
                style={[styles.groupItem, isSelected && styles.selectedItem]}
                onPress={() => handleGroupToggle(group)}
              >
                <View style={styles.groupInfo}>
                  <Text style={[styles.groupName, isSelected && styles.selectedText]}>
                    {group.name}
                  </Text>
                  {group.description && (
                    <Text style={styles.groupDescription}>{group.description}</Text>
                  )}
                </View>
                {isSelected && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        {selectedGroups.length > 0 && (
          <View style={styles.selectedGroupsContainer}>
            <Text style={styles.selectedGroupsTitle}>Selected Groups:</Text>
            <View style={styles.selectedGroups}>
              {selectedGroups.map((group) => (
                <Badge key={group.id} variant="secondary" size="sm" style={styles.groupBadge}>
                  {group.name}
                </Badge>
              ))}
            </View>
          </View>
        )}
      </View>
    );
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
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.inputLabel}>What's happening in your life?</Text>
        <TextInput
          placeholder="e.g., 'I just finished my first marathon!'"
          value={originalText}
          onChangeText={handleTextChange}
          multiline
          numberOfLines={6}
          maxLength={500}
          style={styles.textInputField}
        />
        <Text style={styles.characterCount}>
          {originalText.length}/500
        </Text>

        {renderAudienceSelector()}
        {renderFriendSelector()}
        {renderGroupSelector()}

        <Button
          title={isLoading ? 'Creating...' : '✨ Create Newsflash'}
          onPress={handleSubmit}
          disabled={isSubmitDisabled() || isLoading}
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
  textInputField: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: theme.spacing.sm,
  },
  inputLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  characterCount: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginBottom: theme.spacing.lg,
  },
  audienceSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  audienceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  audienceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  optionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  audienceText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  selectionSection: {
    marginBottom: theme.spacing.lg,
  },
  friendsList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedItem: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  friendName: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  selectedText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  groupsList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  groupDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  selectedGroupsContainer: {
    marginTop: theme.spacing.md,
  },
  selectedGroupsTitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  selectedGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  groupBadge: {
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  submitButton: {
    marginTop: theme.spacing.md,
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

export default CreateScreen; 