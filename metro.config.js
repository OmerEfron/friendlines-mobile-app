const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude Flipper from the build
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure we don't include development-only dependencies
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config; 