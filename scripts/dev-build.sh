#!/bin/bash

# Development Build Management Script for Friendlines
# This script helps create and manage development builds

set -e

echo "🚀 Friendlines Development Build Manager"
echo "========================================"

# Check if EAS CLI is available
if ! command -v npx eas &> /dev/null; then
    echo "❌ EAS CLI not found. Please install it first."
    exit 1
fi

# Check if logged in
if ! npx eas whoami &> /dev/null; then
    echo "❌ Not logged in to EAS. Please run 'npx eas login' first."
    exit 1
fi

# Function to show usage
show_usage() {
    echo "Usage: $0 [android|ios|both] [--local]"
    echo ""
    echo "Options:"
    echo "  android    Build for Android only"
    echo "  ios        Build for iOS only"
    echo "  both       Build for both platforms"
    echo "  --local    Build locally instead of using EAS Build"
    echo ""
    echo "Examples:"
    echo "  $0 android        # Build Android development build"
    echo "  $0 ios --local    # Build iOS locally"
    echo "  $0 both           # Build both platforms"
}

# Parse arguments
PLATFORM=""
LOCAL_BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        android|ios|both)
            PLATFORM="$1"
            shift
            ;;
        --local)
            LOCAL_BUILD=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# If no platform specified, default to both
if [[ -z "$PLATFORM" ]]; then
    PLATFORM="both"
fi

echo "📱 Platform: $PLATFORM"
echo "🏠 Local build: $LOCAL_BUILD"
echo ""

# Check if native projects exist
if [[ ! -d "android" ]] || [[ ! -d "ios" ]]; then
    echo "🔨 Native projects not found. Running prebuild..."
    npx expo prebuild
fi

# Build function
build_platform() {
    local platform=$1
    local local_flag=$2
    
    echo "🔨 Building for $platform..."
    
    if [[ "$local_flag" == "true" ]]; then
        echo "🏠 Building locally..."
        if [[ "$platform" == "android" ]]; then
            npx expo run:android
        elif [[ "$platform" == "ios" ]]; then
            npx expo run:ios
        fi
    else
        echo "☁️  Building with EAS..."
        npx eas build --platform $platform --profile development
    fi
}

# Execute builds
case $PLATFORM in
    android)
        build_platform "android" $LOCAL_BUILD
        ;;
    ios)
        build_platform "ios" $LOCAL_BUILD
        ;;
    both)
        if [[ "$LOCAL_BUILD" == "true" ]]; then
            echo "❌ Local builds for both platforms not supported yet."
            echo "   Please build one platform at a time with --local"
            exit 1
        fi
        build_platform "android" false
        build_platform "ios" false
        ;;
esac

echo ""
echo "✅ Build process completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Install the development build on your device"
echo "   2. Run 'npx expo start' to start the development server"
echo "   3. Scan the QR code or press 'a' for Android / 'i' for iOS"
echo ""
echo "🔗 Useful commands:"
echo "   npx expo start --dev-client    # Start with dev client"
echo "   npx expo start --clear         # Clear cache and start"
echo "   npx eas build:list             # List all builds" 