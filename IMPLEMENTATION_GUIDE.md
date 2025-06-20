# Friendlines Mobile App – Implementation Guide

This document translates the high-level blueprint into an incremental, **runnable** roadmap.  
Each phase ends with a green build you can install on a real device using `expo start`.

---

## Assumptions

- The Expo project is already initialised at the repository root and boots successfully.
- A Git repository is initialised and current code is committed & pushed.
- The typed `apiClient` wrapper is fully implemented and points to the backend.

---

## Phase 0 – Project Hygiene _(½ day)_

| #   | Task                                                                                                                                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1 | Align Node & npm versions with Expo SDK 53 (recommend Node ≥20).                                                                       |
| 0.2 | Run `npm install` then `npx expo-doctor` until all checks pass.                                                                        |
| 0.3 | Add **Husky** pre-commit hooks for eslint, prettier, type-check, and unit tests. Configure **lint-staged** for staged file processing. |
| 0.4 | Verify Metro starts: `expo start` ➜ default placeholder renders on device/simulator.                                                   |
| 0.5 | Commit: `chore(init): green build on device`. Push to `develop`.                                                                       |

### Implementation Notes

- **ESLint v9**: Uses flat config format (`eslint.config.js`) instead of legacy `.eslintrc.js`
- **Module Type**: Added `"type": "module"` to `package.json` for ES module support
- **Testing**: Using `jest-expo` preset with `@testing-library/react-native` (deprecated `@testing-library/jest-native` removed)
- **Husky**: Modern format without deprecated shell script imports
- **Babel**: Configured with module resolver for path aliases (`@/`, `@components/`, etc.)
- **Config Files**: Using `app.json` (static) instead of `app.config.js` (dynamic)

---

## Phase 1 – Shell & Navigation _(1 day)_

Goal: The app boots, shows Splash ➜ Onboarding carousel ➜ Auth stack **or** main Tab stack when `isAuthenticated` is `true`.

### Tasks

1. Implement decision logic in `RootNavigator` (auth vs. main app).
2. Stub `AuthNavigator` with **Login** & **Signup** placeholders.
3. Create `TabNavigator` with tabs **Feed**, **Friends**, **Profile**, **Settings**.
4. Wire `AuthProvider` + `useAuth()` returning `{ user: null }` by default.
5. Wrap root with `ThemeProvider`; add dark-mode switch via `useColorScheme`.

### Deliverables

- Navigation flows correctly on device.
- Snapshot tests for each navigator pass (`jest`).

---

## Phase 2 – Authentication MVP _(2 days)_

Goal: Email / full-name "password-less" login hits the backend.

### Tasks

1. Finish **LoginScreen** and **SignupScreen** UIs.
2. Hook `useLogin`, `useSignup` into `authService` → `apiClient` (`POST /api/login`).
3. Persist user via **expo-secure-store** in `AuthProvider`.
4. Auto-redirect authenticated users to Tab stack on app start.
5. Add unit tests for auth hooks (mock `apiClient`).

### Deliverables

- Create new account & log in on device; restart app and remain logged in.
- Validation & network errors surface via `Toast`.

---

## Phase 3 – Read-Only Feed _(1½ days)_

Goal: Logged-in users can browse a paginated newsfeed.

### Tasks

1. Complete `useFeed` calling `GET /api/posts?page=n`.
2. Build **FeedScreen** with `FlatList` + pull-to-refresh + infinite scroll.
3. Add `NewsflashCard` molecule under `src/components/Card` (avatar, headline, meta).
4. Show skeleton loader using `LoadingSpinner` while fetching.

### Deliverables

- Scrolling feed works; pull-to-refresh fetches new posts.
- Empty state & offline banner handled.

---

## Phase 4 – Post Creation Flow _(2 days)_

Goal: Users compose raw text, preview AI headline, then publish.

### Tasks

1. Build **CreateNewsflashScreen** (text input, char counter, preview modal).
2. `useCreateNewsflash` ➜ `POST /api/posts` (optimistic insertion into local feed).
3. After success, navigate back to Feed & scroll to top.
4. Add Zod validation (1–280 chars).

### Deliverables

- New post appears instantly with generated headline.
- Handle 429 (rate-limit) & 400 (validation) errors gracefully.

---

## Phase 5 – Social Interactions _(1½ days)_

Goal: Likes & follows work end-to-end.

### Tasks

1. Add Like button to `NewsflashCard`; wire to `toggleLike` endpoint.
2. Optimistically update like count; rollback on error.
3. Build **FriendsScreen** & **FriendRequestsScreen** placeholders.
4. Implement `useFriends`, `useFriendRequests` hitting backend.
5. In **UserProfileScreen**, toggle follow status via `toggleFollow`.

### Deliverables

- Like counts update instantly and persist after refresh.
- Follow button toggles state correctly.

---

## Phase 6 – Profile Module _(1 day)_

Goal: Users can view & edit their own profile; view others' profiles.

### Tasks

1. Fill **ProfileScreen** with avatar, stats, list of own posts (reuse `useNewsflash`).
2. **EditProfileScreen** updates full name & avatar (mock image upload).
3. **UserProfileScreen** shows other users + Follow/Unfollow button.

### Deliverables

- Editing profile persists after app relaunch.
- Tap avatar in Feed opens author's profile.

---

## Phase 7 – Groups _(2 days)_

Goal: Create private groups and scoped feeds.

### Tasks

1. CRUD via `groupsService` (`POST /api/groups`, etc.).
2. **GroupsScreen** lists user's groups; FAB opens **CreateGroupScreen**.
3. **GroupDetailScreen** embeds feed filtered by `groupId`.

### Deliverables

- Creating a group, posting inside, and viewing its feed all work.

---

## Phase 8 – Notifications _(1 day)_

Goal: Push notifications for likes & follows in development builds.

### Tasks

1. Register device token with `usePushNotifications` (expo-notifications).
2. Listen for foreground messages; route to **NotificationsScreen**.
3. Ensure tapping a notification deep-links to relevant content.

### Deliverables

- Sending a like from User A pops up on User B's device.

---

## Phase 9 – Polish & QA _(ongoing)_

- Unit & E2E test coverage ≥ 80 %.
- Accessibility pass (VoiceOver, TalkBack).
- Performance profiling & memoisation of heavy lists.
- CI: GitHub Actions green for lint, tests, EAS preview build.

---

## Coding Conventions & Tips

- **Commits**: Conventional Commit messages; push feature branches → PRs.
- **Styling**: Only `styled-components`; no inline styles.
- **Error Handling**: Use `errorService.formatErrorMessage` + `Toast`.
- **Async**: Every async call has `try/catch` and early returns on error.
- **Tests**: Mock `apiClient`; avoid hitting real backend in unit tests.

Keep this guide updated as the project evolves. Happy shipping! 🚀
