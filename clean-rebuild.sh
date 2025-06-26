#!/bin/bash

echo "Stopping all Expo/React Native processes..."
pkill -f "expo" || true
pkill -f "react-native" || true

echo "Removing node_modules and clearing npm cache..."
rm -rf node_modules
npm cache clean --force

echo "Removing Metro and haste-map caches..."
rm -rf $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache

echo "Clearing watchman watches (if installed)..."
if command -v watchman >/dev/null 2>&1; then
  watchman watch-del-all
fi

echo "Reinstalling dependencies..."
npm install

echo "Clearing Expo start cache..."
npx expo start --clear

echo "Rebuilding development client for Android..."
npx eas build --platform android --profile development

echo "All done! If you use iOS, run the iOS build as well:"
echo "  npx eas build --platform ios --profile development"