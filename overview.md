# Friendlines Mobile App - Overview

## 🎯 **App Purpose & Concept**

**Friendlines** is a social mobile application that transforms personal life updates into engaging, newsflash-style headlines and stories using AI technology. The core concept is captured in our tagline: *"Because friendships deserve headlines"* - taking everyday moments and presenting them in an entertaining, news-like format to make social sharing more engaging and fun.

### Key Features
- **AI-Powered Transformation**: Convert personal updates into newspaper-style headlines and articles
- **Sentiment Analysis**: Automatically categorize posts (playful, proud, nostalgic, neutral)
- **Real-time Feed**: Browse transformed updates from your social circle
- **Cross-Platform**: Native iOS and Android experience with web support

## 🏗️ **Tech Stack**

### **Frontend Framework**
- **React Native 0.79.4** - Cross-platform mobile development
- **Expo SDK ~53.0.12** - Managed workflow with modern tooling
- **TypeScript ~5.8.3** - Type-safe development with strict mode

### **Navigation & UI**
- **React Navigation v7** - Bottom tabs + stack navigation
- **React Native Safe Area Context** - Proper safe area handling
- **Custom Theme System** - Consistent design tokens and styling
- **Expo Vector Icons** - Icon library with Ionicons

### **State Management**
- **TanStack React Query v5** - Server state management and caching
- **React Context** - App-wide state and configuration
- **React Hooks** - Local component state management

### **Backend Integration**
- **REST API** - Custom API service with error handling
- **Expo Constants** - Environment configuration
- **Mock Data System** - Development fallbacks and offline support

### **Development & Testing**
- **Jest ^29.7.0** - Testing framework
- **React Native Testing Library** - Component testing utilities
- **TypeScript Compiler** - Type checking and validation
- **ESLint & Prettier** - Code quality and formatting

### **Platform Features**
- **Expo Notifications** - Push notifications
- **Expo Background Task** - Background processing
- **Expo Audio** - Audio functionality
- **Expo SQLite** - Local data storage

## 📁 **File Structure**

```
friendlines-mobile-app-v2/
├── 📱 App Entry Points
│   ├── App.tsx                     # Main app component with providers
│   ├── index.ts                    # Expo entry point
│   ├── app.json                    # Expo configuration
│   └── package.json                # Dependencies and scripts
│
├── 🎨 Assets
│   └── assets/
│       ├── icon.png                # App icon
│       ├── splash-icon.png         # Splash screen
│       └── adaptive-icon.png       # Android adaptive icon
│
├── 🧩 Source Code
│   └── src/
│       ├── 📱 Screens
│       │   ├── HomeScreen.tsx      # Main feed of newsflashes
│       │   ├── CreateScreen.tsx    # Create new newsflash
│       │   └── ProfileScreen.tsx   # User profile management
│       │
│       ├── 🧱 Components
│       │   ├── cards/
│       │   │   ├── Card.tsx        # Base card component
│       │   │   └── NewsflashCard.tsx # Newsflash display card
│       │   ├── common/
│       │   │   ├── Avatar.tsx      # User avatar with fallbacks
│       │   │   ├── Badge.tsx       # Status/category badges
│       │   │   ├── Button.tsx      # Primary button component
│       │   │   └── Input.tsx       # Form input component
│       │   └── index.ts            # Component exports
│       │
│       ├── 🔄 State Management
│       │   ├── contexts/
│       │   │   ├── AppContext.tsx  # Global app state
│       │   │   └── QueryProvider.tsx # React Query setup
│       │   └── hooks/
│       │       ├── useNewsflashes.ts # Main data hook
│       │       ├── useNotification.ts # Notification system
│       │       ├── useMockData.ts  # Development data
│       │       └── useDevice.ts    # Device information
│       │
│       ├── 🧭 Navigation
│       │   └── AppNavigator.tsx    # Tab and stack navigation
│       │
│       ├── 🌐 Services
│       │   └── api.ts              # API service with error handling
│       │
│       ├── 🎨 Styling
│       │   └── styles/
│       │       └── theme.ts        # Design system and theme
│       │
│       ├── 📊 Types
│       │   └── types/
│       │       └── index.ts        # TypeScript interfaces
│       │
│       └── 🛠️ Utilities
│           └── utils/
│               ├── data.ts         # Data transformation utilities
│               ├── storage.ts      # Local storage helpers
│               └── index.ts        # Utility exports
│
├── 🧪 Testing
│   ├── src/__tests__/              # Test files
│   │   ├── components/             # Component tests
│   │   ├── hooks/                  # Hook tests
│   │   └── screens/                # Screen tests
│   ├── jest.config.js              # Jest configuration
│   └── jest.setup.js               # Test setup
│
├── 🤖 AI Rules (Cursor)
│   └── .cursor/rules/              # AI assistant rules
│       ├── agent-tasks/            # Specialized AI agents
│       ├── components/             # Component patterns
│       ├── hooks/                  # Hook patterns
│       ├── services/               # API patterns
│       └── testing/                # Test patterns
│
└── 📋 Configuration
    ├── tsconfig.json               # TypeScript configuration
    ├── package-lock.json           # Dependency lock file
    └── scripts/
        └── validate-app.js         # App validation script
```

## 🎨 **App Design Architecture**

### **Design Principles**
- **Newsflash Theme**: All UI elements reinforce the "news" concept
- **Consistent Spacing**: Theme-based spacing scale for visual harmony
- **Accessibility First**: Proper labels, touch targets, and screen reader support
- **Platform Adaptive**: Respects iOS and Android design patterns

### **Component Architecture**
- **Atomic Design**: Small, reusable components (Button, Badge, Avatar)
- **Composite Components**: Complex components (Card, NewsflashCard)
- **Screen Components**: Full-screen layouts with consistent structure
- **Theme Integration**: All styling uses centralized theme system

### **Data Flow**
```
User Action → Hook (React Query) → API Service → Backend
     ↓              ↓                    ↓
UI Updates ← Cache Update ← Response Processing
```

### **Key Design Patterns**

#### **Newsflash Transformation Flow**
1. User inputs personal update text
2. AI transforms into headline + news-style article
3. Sentiment analysis adds emotional context
4. Content displayed in newspaper-style card format

#### **Social Interaction Model**
- **Friends**: Individual user relationships
- **Groups**: Collections of users for targeted sharing
- **Recipients**: Flexible sharing (individuals, groups, or all friends)

#### **Error Handling Strategy**
- **Graceful Degradation**: Mock data when API unavailable
- **User Feedback**: Toast notifications for success/error states
- **Retry Logic**: Automatic retries with exponential backoff

## 🚀 **Development Workflow**

### **Available Scripts**
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm test` - Run test suite
- `npm run test:coverage` - Generate coverage report
- `npm run type-check` - TypeScript validation
- `npm run validate` - Full app validation

### **Key Development Features**
- **Hot Reload** - Instant code updates during development
- **TypeScript Strict Mode** - Comprehensive type checking
- **Test Coverage** - Automated testing with coverage reports
- **Performance Monitoring** - Built-in performance tracking
- **Cross-Platform Testing** - iOS, Android, and web support

## 🔮 **Future Considerations**

### **Scalability**
- Modular architecture supports feature expansion
- React Query caching optimizes performance
- Type system ensures maintainable code growth

### **Platform Extensions**
- Web version via Expo Web
- Desktop support potential
- API-first design supports multiple clients

### **AI Enhancement**
- Pluggable AI transformation system
- Multiple AI providers support
- Enhanced sentiment analysis capabilities 