# Friendlines Mobile App – **Frontend Blueprint** (Expo + React Native)

> A living document that describes every critical aspect of the Friendlines mobile application's frontend. It covers the project vision, technology choices, folder conventions, coding patterns, and day-to-day workflows for contributors.

---

## 📜 Table of Contents

- [Friendlines Mobile App – **Frontend Blueprint** (Expo + React Native)](#friendlines-mobile-app--frontend-blueprint-expo--react-native)
  - [📜 Table of Contents](#-table-of-contents)
  - [🧠 App Vision](#-app-vision)
  - [🔧 Tech Stack](#-tech-stack)
  - [🚀 Quick Start Guide](#-quick-start-guide)
  - [🗂 Project Structure](#-project-structure)
  - [🏛 Architecture \& Design](#-architecture--design)
  - [📱 Screens \& User Flows](#-screens--user-flows)
  - [🧩 Core Modules](#-core-modules)
    - [Authentication](#authentication)
    - [Newsflash Engine](#newsflash-engine)
    - [Friends \& Groups](#friends--groups)
    - [Notifications](#notifications)
  - [🎨 Styling \& Theming](#-styling--theming)
  - [🛠 Error Handling \& Logging](#-error-handling--logging)
  - [🧪 Testing Strategy](#-testing-strategy)
  - [🚚 Continuous Integration \& Deployment](#-continuous-integration--deployment)
  - [🤝 Contributing Guidelines](#-contributing-guidelines)
  - [🔮 Roadmap](#-roadmap)

---

## 🧠 App Vision

Friendlines is a minimalist social newsfeed that distills your friends' daily updates into AI-generated, newsflash-style headlines. The goal is to surface the most interesting snippets of your social circle in a clean, _zero-noise_ interface while keeping users in control of what they share and consume.

- **Instant Headlines:** The moment a user posts, our LLM service transforms the content into a punchy headline.
- **Smart Notifications:** Context-aware push notifications ensure users never miss out on meaningful updates.
- **Modular & Lightweight:** A component-driven architecture enables rapid iteration without code bloat.

---

## 🔧 Tech Stack

| Layer                     | Package(s)                    | Version(s)                            | Notes                                                                          |
| ------------------------- | ----------------------------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| Runtime                   | expo                          | **53.0.0**                            | Bundles **react-native 0.79.0** + **react 19.0.0**                             |
| Language                  | typescript                    | **~5.8.3**                            | Recommended by Expo SDK 53                                                     |
| Navigation                | @react-navigation/native      | **7.2.1**                             | Requires `react-native-screens 5.22.1`, `react-native-safe-area-context 4.7.4` |
| Styling                   | styled-components             | **6.1.3**                             | Verified with React 19 / RN 0.79                                               |
| Networking                | axios                         | **1.6.5**                             | Promise-based HTTP client with interceptors for auth & logging                 |
| State                     | React Context + custom hooks  | n/a                                   | No external state lib to avoid bloat                                           |
| Forms                     | react-hook-form               | **7.51.2**                            | Peer-depends on React ≥17 (works with 19)                                      |
| Validation                | zod                           | **3.24.3**                            | Tree-shakable schemas                                                          |
| Auth                      | expo-auth-session             | **6.0.0**                             | Matches Expo 53 modules                                                        |
| Secure Storage            | expo-secure-store             | **13.0.0**                            | Persistent, encrypted key-value store                                          |
| Push / Notifications      | expo-notifications            | **0.24.0**                            | SDK 53 compatible                                                              |
| Background Tasks          | expo-background-task          | **1.0.0**                             | Modern replacement for `expo-background-fetch`                                 |
| Testing (unit)            | jest-expo                     | **53.0.7**                            | Expo SDK 53 compatible preset                                                  |
| Testing (Testing Library) | @testing-library/react-native | **13.2.0**                            | Modern testing utilities                                                       |
| Testing (E2E)             | detox                         | **22.0.0**                            | Aligned with RN 0.79                                                           |
| Linting                   | eslint / prettier             | **eslint 9.29.0**, **prettier 3.5.3** | ESLint flat config format, TypeScript integration                              |
| Git Hooks                 | husky                         | **9.1.7**                             | Modern git hooks with lint-staged                                              |
| Code Quality              | lint-staged                   | **16.1.2**                            | Staged files linting                                                           |
| CI/CD                     | eas-cli                       | **8.0.0**                             | Required for EAS Build & Update                                                |

> All versions verified for compatibility with **Expo SDK 53** (React Native 0.79) as of **Oct 2025**. When upgrading Expo or React Native, always consult the official release notes and run `expo doctor` / `expo install --fix` to realign peer dependencies.

---

## 🚀 Quick Start Guide

```bash
# 1. Install global tooling
npm install --global expo-cli eas-cli

# 2. Clone the repo
git clone https://github.com/your-org/friendlines.git
cd friendlines

# 3. Navigate to the app directory
cd app

# 4. Install dependencies
npm install

# 5. Run the development server
expo start --tunnel

# 6. Build & launch on iOS/Android simulator
expo run:ios   # or expo run:android
```

> **Tip:** Use `expo doctor` if you bump into environment issues.

---

## 🗂 Project Structure

The project follows a _feature-first_ layout inside `src/`, keeping screens, related hooks, styles, and tests together.

```text
friendlines/
├── friendlines-app-structure.md  # This blueprint document
└── app/                          # Main application directory
    │
    ├── app.config.js             # Dynamic Expo config (reads env vars)
    ├── .eslintrc.js              # ESLint configuration
    ├── jest.config.js            # Jest test configuration
    ├── babel.config.js           # Babel transpilation config
    ├── metro.config.js           # Metro bundler config
    ├── eas.json                  # EAS Build & Update configuration
    ├── README.md                 # Project documentation
    │
    ├── .github/workflows/        # CI pipelines (lint, test, EAS build)
    │   ├── lint-test.yml
    │   └── eas-build.yml
    │
    ├── assets/                   # Images, fonts, lottie files
    │   ├── fonts/
    │   └── icons/
    │
    └── src/
        ├── components/           # Pure, reusable UI atoms & molecules
        │   ├── Button/
        │   │   ├── Button.tsx
        │   │   ├── styles.ts
        │   │   └── index.ts
        │   ├── Avatar/
        │   ├── Card/
        │   ├── Input/
        │   ├── LoadingSpinner/
        │   ├── Modal/
        │   ├── Toast/
        │   └── index.ts          # Component barrel exports
        │
        ├── features/             # Product domains ("auth", "newsflash", ...)
        │   ├── auth/
        │   │   ├── screens/
        │   │   │   ├── SplashScreen.tsx
        │   │   │   ├── OnboardingScreen.tsx
        │   │   │   ├── LoginScreen.tsx
        │   │   │   ├── SignupScreen.tsx
        │   │   │   └── ForgotPasswordScreen.tsx
        │   │   ├── hooks/
        │   │   │   ├── useAuth.ts
        │   │   │   ├── useLogin.ts
        │   │   │   └── useSignup.ts
        │   │   ├── services/
        │   │   │   ├── authService.ts
        │   │   │   └── tokenService.ts
        │   │   ├── types.ts
        │   │   └── index.ts
        │   │
        │   ├── newsflash/
        │   │   ├── screens/
        │   │   │   ├── FeedScreen.tsx
        │   │   │   ├── CreateNewsflashScreen.tsx
        │   │   │   └── NewsflashDetailScreen.tsx
        │   │   ├── hooks/
        │   │   │   ├── useNewsflash.ts
        │   │   │   ├── useFeed.ts
        │   │   │   └── useCreateNewsflash.ts
        │   │   ├── services/
        │   │   │   ├── newsflashService.ts
        │   │   │   └── llmService.ts
        │   │   ├── types.ts
        │   │   └── index.ts
        │   │
        │   ├── social/
        │   │   ├── screens/
        │   │   │   ├── FriendsScreen.tsx
        │   │   │   ├── FriendRequestsScreen.tsx
        │   │   │   └── UserProfileScreen.tsx
        │   │   ├── hooks/
        │   │   │   ├── useFriends.ts
        │   │   │   ├── useFriendRequests.ts
        │   │   │   └── useUserProfile.ts
        │   │   ├── services/
        │   │   │   ├── friendsService.ts
        │   │   │   └── userService.ts
        │   │   ├── types.ts
        │   │   └── index.ts
        │   │
        │   ├── groups/
        │   │   ├── screens/
        │   │   │   ├── GroupsScreen.tsx
        │   │   │   ├── GroupDetailScreen.tsx
        │   │   │   └── CreateGroupScreen.tsx
        │   │   ├── hooks/
        │   │   │   ├── useGroups.ts
        │   │   │   ├── useGroupDetail.ts
        │   │   │   └── useCreateGroup.ts
        │   │   ├── services/
        │   │   │   └── groupsService.ts
        │   │   ├── types.ts
        │   │   └── index.ts
        │   │
        │   ├── profile/
        │   │   ├── screens/
        │   │   │   ├── ProfileScreen.tsx
        │   │   │   ├── EditProfileScreen.tsx
        │   │   │   └── SettingsScreen.tsx
        │   │   ├── hooks/
        │   │   │   ├── useProfile.ts
        │   │   │   └── useSettings.ts
        │   │   ├── services/
        │   │   │   └── profileService.ts
        │   │   ├── types.ts
        │   │   └── index.ts
        │   │
        │   └── notifications/
        │       ├── screens/
        │       │   └── NotificationsScreen.tsx
        │       ├── hooks/
        │       │   ├── useNotifications.ts
        │       │   └── usePushNotifications.ts
        │       ├── services/
        │       │   ├── notificationService.ts
        │       │   └── pushService.ts
        │       ├── types.ts
        │       └── index.ts
        │
        ├── navigation/
        │   ├── index.tsx           # Entry point for navigators
        │   ├── RootNavigator.tsx   # Switches between auth & main stacks
        │   ├── TabNavigator.tsx    # Bottom tab bar
        │   ├── AuthNavigator.tsx   # Authentication flow navigation
        │   └── types.ts            # Navigation type definitions
        │
        ├── hooks/                  # App-wide reusable hooks
        │   ├── useDebounce.ts
        │   ├── useAsync.ts
        │   ├── useLocalStorage.ts
        │   ├── useColorScheme.ts
        │   └── index.ts
        │
        ├── context/                # Global providers
        │   ├── AuthProvider.tsx
        │   ├── ThemeProvider.tsx
        │   └── index.ts
        │
        ├── services/               # Cross-feature network calls
        │   ├── apiClient.ts
        │   ├── storageService.ts
        │   ├── errorService.ts
        │   └── index.ts
        │
        ├── theme/                  # Colors, spacing, typography, styled-system
        │   ├── index.ts
        │   ├── colors.ts
        │   ├── typography.ts
        │   ├── spacing.ts
        │   └── shadows.ts
        │
        ├── utils/                  # Helpers (date, storage, platform checks)
        │   ├── dateUtils.ts
        │   ├── validationUtils.ts
        │   ├── formatUtils.ts
        │   ├── platformUtils.ts
        │   └── index.ts
        │
        ├── types/                  # Shared TypeScript interfaces & enums
        │   ├── api.ts
        │   ├── user.ts
        │   ├── newsflash.ts
        │   ├── navigation.ts
        │   ├── theme.ts
        │   └── index.ts
        │
        ├── constants/              # App-wide constants
        │   ├── api.ts
        │   ├── app.ts
        │   ├── theme.ts
        │   └── index.ts
        │
        ├── shared/                 # Cross-feature reusable modules
        │   ├── components/
        │   ├── hooks/
        │   └── utils/
        │
        └── __tests__/              # Global unit tests
            ├── setup.ts
            └── testUtils.tsx
```

> **Rule of Thumb:** If code is **reused by more than one feature**, place it in `/src/shared` (alias `@shared`) instead of duplicating.

---

## 🏛 Architecture & Design

1. **Navigation Shell** – A top-level `RootNavigator` decides whether to display the _Auth_ stack or the main _App_ stack (tabs wrapped in a stack for modals). An `AuthNavigator` handles the authentication flow screens.
2. **Context Providers** – `AuthProvider` and `ThemeProvider` wrap the root component to inject global state using React Context + custom hooks pattern.
3. **Atomic Components** – Build complex UIs by composing _atoms_ (Button) ➜ _molecules_ (Card) ➜ _organisms_ (Feed List). Each component includes TypeScript definitions, styled-components styles, and barrel exports.
4. **Service Layer** – `services/*.ts` files encapsulate API logic, returning typed data to screens. All calls go through a single `apiClient` with interceptors for auth tokens & error normalization.
5. **LLM Workflow** – `llmService` sends user updates to the backend, which calls OpenAI. The generated headline returns to the mobile app to show a preview before posting.
6. **Offline Support** – Leveraging **Expo FileSystem** & **SQLite** for caching feed data and queued posts when offline.
7. **Theming** – Colors, spacing, typography, and shadows live in `src/theme`. A dark theme is generated automatically with utility helpers.
8. **Feature Organization** – Each feature (auth, newsflash, social, groups, profile, notifications) contains its own screens, hooks, services, and types, promoting modularity and maintainability.

---

## 📱 Screens & User Flows

| Screen               | Primary Function                   | Key Interactions                                   |
| -------------------- | ---------------------------------- | -------------------------------------------------- |
| **Splash**           | Logo display & environment prep    | Auto-navigate after 2 sec.                         |
| **Onboarding**       | Explain value prop & permissions   | Swiping carousel, final _Get Started_ button.      |
| **Login**            | User authentication                | Email/password entry, social login options         |
| **Signup**           | New user registration              | Form validation, terms acceptance                  |
| **Forgot Password**  | Password recovery                  | Email input, reset instructions                    |
| **Feed**             | Scrollable list of newsflash cards | Pull-to-refresh, infinite scroll, reaction buttons |
| **Create Newsflash** | Compose update ➜ headline preview  | Character counter, share scope toggles             |
| **Newsflash Detail** | Full newsflash view                | Comments, reactions, sharing                       |
| **Friends**          | Manage friendships                 | Accept/reject requests, search users               |
| **Friend Requests**  | Pending friend requests            | Accept/decline actions                             |
| **User Profile**     | View other users' profiles         | Send friend request, view posts                    |
| **Groups**           | Organize friends into groups       | Create groups, view group lists                    |
| **Group Detail**     | Group-specific content             | Group posts, member management                     |
| **Create Group**     | New group creation                 | Group name, description, member selection          |
| **Profile**          | View personal profile              | Display user info, posts, settings access          |
| **Edit Profile**     | Modify user information            | Update avatar, bio, personal details               |
| **Settings**         | App preferences & privacy          | Notification settings, privacy controls            |
| **Notifications**    | Real-time updates feed             | Mark as read, deep-link to content                 |

> See `/app/src/features/*/screens` for the exact implementation of each screen.

---

## 🧩 Core Modules

### Authentication

- Email/password + Social (Apple/Google) via **expo-auth-session**.
- JWT persisted with **expo-secure-store**.

### Newsflash Engine

- `newsflashService.create()` handles draft ➜ headline generation ➜ publish.
- Uses optimistic UI to inject the new post into the feed instantly.

### Friends & Groups

- Connection graph stored server-side; client queries paginated endpoints.
- Local filter/search implemented with **Fuse.js** for fuzzy matching.

### Notifications

- **expo-notifications** registers device tokens and handles foreground messages.
- Tapping a push opens the related screen via deep-link.

---

## 🎨 Styling & Theming

- **styled-components** with a centralized theme object (`src/theme/index.ts`).
- Use `REM` utilities for responsive sizing: `pxToRem(14)`.
- No inline styles—maintain separation of concerns.
- `ThemeProvider` dynamically switches between light/dark using `useColorScheme()`.

```tsx
// Example usage
const Headline = styled.Text(({ theme }) => ({
  fontFamily: theme.fonts.bold,
  fontSize: theme.fontSizes.lg,
  color: theme.colors.textPrimary,
}));
```

---

## 🛠 Error Handling & Logging

1. _Global API Errors_ ➜ Interceptor formats to `{ code, message }` and surfaces snackbars via `useToast`.
2. _Crash Reporting_ ➜ **Sentry** integration sends stack traces along with React Context state snapshot.
3. _Boundary Components_ ➜ `ErrorBoundary` around navigation tree renders a fallback UI.
4. _Error Service_ ➜ Centralized error logging and handling through `errorService.ts`.

---

## 🧪 Testing Strategy

- **Unit Tests** (Jest): functions, hooks, and services.
- **Component Tests** (React Native Testing Library): interactive components.
- **End-to-End** (Detox): critical user journeys (login ➜ post ➜ notification).
- **Test Setup** ➜ Global test configuration in `src/__tests__/setup.ts` and utilities in `testUtils.tsx`.
- **Lint & Type Checks** on every pull request via GitHub Actions.

---

## 🚚 Continuous Integration & Deployment

- **GitHub Actions**
  - `lint-test.yml`: ESLint, TypeScript check, Jest.
  - `eas-build.yml`: Trigger EAS builds for `preview`, `staging`, `production` channels.
- **EAS Update** delivers over-the-air updates to users.
- Store secrets (API keys, Sentry DSN) in **GitHub Secrets** + `eas.json`.

---

## 🤝 Contributing Guidelines

1. **Branch Naming** – `feature/<name>` or `fix/<name>`.
2. **Commits** – Conventional Commits (`feat:`, `fix:`, `chore:`).
3. **Pull Requests** – Draft until all checks pass. Include screenshots/GIFs.
4. **Code Review** – At least one approval required. Address comments promptly.
5. **Style** – Run `yarn lint --fix && yarn format` before pushing.

---

## 🔮 Roadmap

- [x] Define core scaffold & navigation
- [ ] Implement offline cache layer
- [ ] Add real-time chat in group screen
- [ ] Introduce in-app purchase for premium AI features
- [ ] Internationalization (i18n) & RTL support

> _This document should evolve with the codebase. Feel free to propose updates via pull request._

---

© 2025 Friendlines. All rights reserved.
