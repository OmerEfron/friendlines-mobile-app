# Development Build Guide for Friendlines

This guide explains how to use development builds for the Friendlines mobile app.

## What is a Development Build?

A development build is a debug build of your app that includes the `expo-dev-client` library. It provides:
- Better error handling and debugging capabilities
- Support for custom native modules
- Ability to switch between different development servers
- More flexible development environment than Expo Go

## Prerequisites

- Node.js (v18+)
- EAS CLI: `npm install -g eas-cli`
- EAS Account: `npx eas login`
- For local builds: Android Studio (Android) or Xcode (iOS)

## Quick Start

### 1. Create a Development Build

```bash
# Build for Android
npm run dev:build:android

# Build for iOS
npm run dev:build:ios

# Build for both platforms
npm run dev:build:both

# Or use the script
./scripts/dev-build.sh android
./scripts/dev-build.sh ios
./scripts/dev-build.sh both
```

### 2. Install the Development Build

After the build completes:
1. Download the APK/IPA file from EAS Build
2. Install it on your device/emulator
3. For iOS: You may need to trust the developer certificate

### 3. Start Development Server

```bash
# Start with dev client
npm run dev:start

# Start with cleared cache
npm run dev:start:clear
```

### 4. Connect Your Device

- **Android**: Press 'a' in the terminal or scan QR code
- **iOS**: Press 'i' in the terminal or scan QR code
- **Physical Device**: Scan the QR code with your camera

## Development Workflow

### Daily Development

1. **Start the development server:**
   ```bash
   npm run dev:start
   ```

2. **Make changes to your code**

3. **See changes instantly** on your device (hot reload)

4. **When you need native changes:**
   ```bash
   npx expo prebuild
   npm run dev:build:android  # or ios
   ```

### Adding Native Dependencies

1. Install the package:
   ```bash
   npx expo install <package-name>
   ```

2. If it requires native code, rebuild:
   ```bash
   npx expo prebuild
   npm run dev:build:android  # or ios
   ```

### Debugging

- **React Native Debugger**: Works with development builds
- **Flipper**: Available for advanced debugging
- **Console logs**: Visible in Metro bundler terminal
- **Error overlay**: Shows errors directly on device

## Useful Commands

```bash
# List all builds
npm run build:list

# Run prebuild (regenerate native projects)
npm run prebuild

# Start with specific options
npx expo start --dev-client --clear
npx expo start --dev-client --tunnel

# Build locally (requires Android Studio/Xcode)
npx expo run:android
npx expo run:ios
```

## Troubleshooting

### Common Issues

1. **Build fails with native module errors:**
   ```bash
   npx expo prebuild --clean
   npm run dev:build:android
   ```

2. **App crashes on startup:**
   - Check Metro bundler logs
   - Try clearing cache: `npm run dev:start:clear`
   - Verify all dependencies are installed

3. **Changes not reflecting:**
   - Ensure you're using the development build, not Expo Go
   - Try clearing cache: `npm run dev:start:clear`
   - Check if the development server is running

4. **Cannot connect to development server:**
   - Ensure device and computer are on same network
   - Try using tunnel: `npx expo start --dev-client --tunnel`
   - Check firewall settings

### Performance Tips

- Use `npm run dev:start:clear` when experiencing issues
- Restart the development server periodically
- Keep your development build updated when adding native modules

## Configuration Files

- `app.json`: App configuration and plugins
- `eas.json`: EAS Build configuration
- `package.json`: Dependencies and scripts
- `metro.config.js`: Metro bundler configuration

## Next Steps

Once you have a development build:
1. Install it on your device
2. Start developing with `npm run dev:start`
3. Make changes and see them instantly
4. When you need native changes, rebuild the development build

## Resources

- [Expo Development Builds Documentation](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Debugging](https://reactnative.dev/docs/debugging) 