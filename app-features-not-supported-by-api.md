# App Features Not Supported by API

This document outlines all the features that exist in the Friendlines mobile app but are either not supported by the current API or are implemented using mock data/local functionality instead of API calls.

## 🔍 Search Functionality

### Current Implementation
- **Location**: `src/screens/SearchScreen.tsx`, `src/utils/data.ts`
- **Status**: Fully implemented in app, but uses local search
- **Features**:
  - Search across newsflashes, people (friends), and groups
  - Sentiment-based filtering (playful, proud, nostalgic)
  - Real-time search results
  - Tabbed interface for different content types

### API Gap
- **Missing**: No search API endpoints
- **Current**: Uses local filtering of cached data from other API calls
- **Impact**: Search only works on data already loaded in the app

### Required API Endpoints
```typescript
// Search endpoints needed
GET /api/search/newsflashes?q={query}&sentiment={sentiment}&page={page}&limit={limit}
GET /api/search/users?q={query}&page={page}&limit={limit}
GET /api/search/groups?q={query}&page={page}&limit={limit}
GET /api/search/global?q={query}&types={newsflashes,users,groups}&page={page}&limit={limit}
```

---

## 📊 Trending Topics & Popular Content

### Current Implementation
- **Location**: `src/components/common/TrendingSection.tsx`, `src/screens/HomeScreen.tsx`
- **Status**: Implemented with local data processing
- **Features**:
  - Trending topics extracted from newsflash content
  - Popular newsflashes (random selection for demo)
  - Sentiment-based topic categorization
  - Real-time topic counting

### API Gap
- **Missing**: No trending/popular content API endpoints
- **Current**: Uses client-side word frequency analysis
- **Impact**: Limited to local data, no global trending insights

### Required API Endpoints
```typescript
// Trending endpoints needed
GET /api/trending/topics?period={day,week,month}&limit={limit}
GET /api/trending/newsflashes?period={day,week,month}&limit={limit}
GET /api/popular/newsflashes?period={day,week,month}&limit={limit}
GET /api/trending/sentiments?period={day,week,month}
```

---

## 🔖 Bookmarking System

### Current Implementation
- **Location**: `src/components/cards/NewsflashCard.tsx`, `src/components/common/AnimatedNewsflashCard.tsx`
- **Status**: UI implemented, functionality mocked
- **Features**:
  - Bookmark/unbookmark newsflashes
  - Visual bookmark state
  - Bookmark button in newsflash cards

### API Gap
- **Missing**: No bookmark API endpoints
- **Current**: Shows "Bookmark functionality coming soon!" alert
- **Impact**: No persistent bookmark storage

### Required API Endpoints
```typescript
// Bookmark endpoints needed
POST /api/bookmarks/{newsflashId}
DELETE /api/bookmarks/{newsflashId}
GET /api/bookmarks?page={page}&limit={limit}
GET /api/bookmarks/{newsflashId}/status
```

---

## ⚙️ Settings & Preferences

### Current Implementation
- **Location**: `src/screens/SettingsScreen.tsx`
- **Status**: UI implemented, most features mocked
- **Features**:
  - Push notification toggle
  - Dark mode toggle
  - Auto refresh toggle
  - Profile editing (mocked)
  - Privacy settings (mocked)
  - Data usage settings (mocked)
  - Help & support (mocked)

### API Gap
- **Missing**: No user preferences/settings API endpoints
- **Current**: All settings are local state only
- **Impact**: Settings don't persist across devices

### Required API Endpoints
```typescript
// Settings endpoints needed
GET /api/users/{userId}/preferences
PUT /api/users/{userId}/preferences
GET /api/users/{userId}/settings
PUT /api/users/{userId}/settings
POST /api/users/{userId}/notifications/settings
```

---

## 📈 User Statistics & Analytics

### Current Implementation
- **Location**: `src/screens/UserFeedScreen.tsx` (Stats tab)
- **Status**: UI placeholder, no real data
- **Features**:
  - Stats tab in user profile
  - Placeholder for user analytics

### API Gap
- **Missing**: No user statistics API endpoints
- **Current**: No real statistics implementation
- **Impact**: No user engagement insights

### Required API Endpoints
```typescript
// Statistics endpoints needed
GET /api/users/{userId}/stats
GET /api/users/{userId}/stats/newsflashes
GET /api/users/{userId}/stats/engagement
GET /api/users/{userId}/stats/friends
GET /api/users/{userId}/stats/groups
```

---

## 🎨 Dark Mode & Theme System

### Current Implementation
- **Location**: `src/screens/SettingsScreen.tsx`, `src/styles/theme.ts`
- **Status**: Toggle implemented, but no persistence
- **Features**:
  - Dark mode toggle in settings
  - Theme system with multiple color schemes

### API Gap
- **Missing**: No theme preference API endpoints
- **Current**: Local state only
- **Impact**: Theme preference doesn't sync across devices

### Required API Endpoints
```typescript
// Theme endpoints needed
GET /api/users/{userId}/theme
PUT /api/users/{userId}/theme
```

---

## 🔄 Auto Refresh & Data Management

### Current Implementation
- **Location**: `src/screens/SettingsScreen.tsx`, `src/screens/HomeScreen.tsx`
- **Status**: Toggle implemented, but no real functionality
- **Features**:
  - Auto refresh toggle in settings
  - Manual refresh with pull-to-refresh

### API Gap
- **Missing**: No data management API endpoints
- **Current**: Basic refresh functionality only
- **Impact**: No intelligent data synchronization

### Required API Endpoints
```typescript
// Data management endpoints needed
GET /api/users/{userId}/data/usage
POST /api/users/{userId}/data/clear-cache
GET /api/users/{userId}/data/sync-status
```

---

## 👥 Profile Management

### Current Implementation
- **Location**: `src/screens/ProfileScreen.tsx`, `src/screens/SettingsScreen.tsx`
- **Status**: Basic profile display, editing mocked
- **Features**:
  - Profile display with avatar, name, email
  - Follower/following counts (if available)
  - Edit profile option (mocked)

### API Gap
- **Missing**: Limited profile management API endpoints
- **Current**: Basic user info from auth, no extended profile
- **Impact**: Limited profile customization

### Required API Endpoints
```typescript
// Profile endpoints needed (some exist but need enhancement)
PUT /api/users/{userId}/avatar
PUT /api/users/{userId}/bio
PUT /api/users/{userId}/location
PUT /api/users/{userId}/website
GET /api/users/{userId}/profile/stats
```

---

## 📱 Push Notification Management

### Current Implementation
- **Location**: `src/hooks/usePushNotifications.ts`, `src/screens/SettingsScreen.tsx`
- **Status**: Token registration works, but settings are local
- **Features**:
  - Push token registration
  - Notification toggle in settings
  - Basic notification handling

### API Gap
- **Missing**: No notification preferences API endpoints
- **Current**: Only token registration, no preference management
- **Impact**: Can't customize notification types

### Required API Endpoints
```typescript
// Notification management endpoints needed
GET /api/users/{userId}/notifications/preferences
PUT /api/users/{userId}/notifications/preferences
POST /api/users/{userId}/notifications/test
GET /api/users/{userId}/notifications/history
```

---

## 🏷️ Sentiment Analysis & Filtering

### Current Implementation
- **Location**: `src/screens/SearchScreen.tsx`, `src/screens/HomeScreen.tsx`
- **Status**: UI implemented, but limited data
- **Features**:
  - Sentiment-based filtering (playful, proud, nostalgic)
  - Sentiment badges on newsflashes
  - Sentiment-based trending topics

### API Gap
- **Missing**: No sentiment analysis API endpoints
- **Current**: Relies on sentiment data from newsflash generation
- **Impact**: Limited sentiment analysis capabilities

### Required API Endpoints
```typescript
// Sentiment analysis endpoints needed
POST /api/sentiment/analyze
GET /api/sentiment/trends
GET /api/sentiment/{userId}/preferences
```

---

## 📋 Data Export & Privacy

### Current Implementation
- **Location**: `src/screens/SettingsScreen.tsx` (mocked)
- **Status**: UI placeholders only
- **Features**:
  - Privacy settings placeholder
  - Data usage placeholder

### API Gap
- **Missing**: No data export/privacy API endpoints
- **Current**: No real privacy controls
- **Impact**: No GDPR compliance features

### Required API Endpoints
```typescript
// Privacy and data export endpoints needed
GET /api/users/{userId}/data/export
DELETE /api/users/{userId}/data
GET /api/users/{userId}/privacy/settings
PUT /api/users/{userId}/privacy/settings
```

---

## 🎯 Content Discovery & Recommendations

### Current Implementation
- **Location**: `src/screens/HomeScreen.tsx` (trending section)
- **Status**: Basic trending topics only
- **Features**:
  - Trending topics from local data
  - Popular newsflashes (random selection)

### API Gap
- **Missing**: No recommendation/discovery API endpoints
- **Current**: No intelligent content recommendations
- **Impact**: Limited content discovery

### Required API Endpoints
```typescript
// Recommendation endpoints needed
GET /api/recommendations/newsflashes
GET /api/recommendations/users
GET /api/recommendations/groups
GET /api/discovery/trending
GET /api/discovery/for-you
```

---

## 📊 Content Analytics & Insights

### Current Implementation
- **Location**: Various components (view counts, etc.)
- **Status**: Mock data only
- **Features**:
  - View counts on newsflashes (random)
  - Basic engagement metrics

### API Gap
- **Missing**: No analytics API endpoints
- **Current**: No real analytics data
- **Impact**: No content performance insights

### Required API Endpoints
```typescript
// Analytics endpoints needed
GET /api/analytics/newsflashes/{newsflashId}
GET /api/analytics/users/{userId}/content
GET /api/analytics/engagement
POST /api/analytics/events
```

---

## Summary

The app has a rich feature set with excellent UI/UX, but many features rely on local state or mock data instead of proper API integration. The main areas needing API support are:

1. **Search & Discovery** - Currently local-only
2. **Bookmarking** - UI only, no backend
3. **Settings & Preferences** - Local state only
4. **Analytics & Statistics** - Mock data only
5. **Content Recommendations** - Basic local trending
6. **Privacy & Data Management** - Placeholder features

These features would significantly enhance the user experience if properly integrated with backend APIs. 