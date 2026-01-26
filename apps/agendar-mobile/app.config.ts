import type { ExpoConfig } from "expo/config"
import "ts-node/register"

const isProduction = process.env.EXPO_PUBLIC_APP_VARIANT === "production"

const name = isProduction ? "Agendar" : "Agendar Dev"
const bundleIdentifier = isProduction ? "br.tec.agendar" : "br.tec.agendar.dev"
const scheme = isProduction ? "agendar" : "agendar-dev"

const googleServicesFileIos = isProduction
  ? "./GoogleService-Info.plist"
  : "./GoogleService-Info-dev.plist"

const googleServicesFileAndroid = isProduction
  ? "./google-services.json"
  : "./google-services-dev.json"

const config: ExpoConfig = {
  name,
  slug: "agendar",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier,
    googleServicesFile: googleServicesFileIos,
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: bundleIdentifier,
    googleServicesFile: googleServicesFileAndroid,
    softwareKeyboardLayoutMode: "resize",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          buildReactNativeFromSource: true,
        },
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
    [
      "expo-splash-screen",
      {
        ios: {
          backgroundColor: "#001240",
          image: "./assets/icon.png",
          resizeMode: "cover",
        },
        android: {
          backgroundColor: "#001240",
          image: "./assets/icon.png",
          imageWidth: 150,
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "dc3cceea-211d-4060-811c-4674385e6b23",
    },
  },
  experiments: {
    typedRoutes: true,
  },
}

export default config
