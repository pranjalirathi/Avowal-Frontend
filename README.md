# AVOWAL - Anonymous Confession Social Media App

AVOWAL is a modern anonymous confession app built with React Native that allows users to post confessions without revealing their identity. Users can tag friends, comment on posts, search for other users, and interact in a fun and secure social environment with JWT-based authentication and real-time features!

## 📱 Features

- **✨ Anonymous Confessions:** Post confessions without revealing your identity
- **👥 Tag Users:** Mention/tag other users in your confessions
- **💬 Comments:** Add comments to any confession post
- **🔍 Find Users:** Search for users and check out their relationship status
- **👤 Profile Customization:** Make your profile customized with avatars and status
- **🔐 Secure Authentication:** JWT-based login/signup with token expiration handling
- **🔄 Real-time Search:** Debounced user search functionality
- **🔗 Deep Linking:** Support for password reset links
- **📱 APK Distribution:** Web-based APK download system
- **💾 Secure Storage:** Encrypted token storage using AsyncStorage

## 💻 Technologies Used

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="React logo" height="30px"> <img src="https://www.svgrepo.com/show/303206/javascript-logo.svg" alt="javscript" height="30px">

## 🛠️ Tech Stack

**Frontend & Mobile:**
- React Native
- React Navigation (stack, bottom tabs)
- React Native Paper (UI components)
- React Native Reanimated (animations)
- React Native Gesture Handler (gestures)
- React Native SVG & Vector Icons (icons)
- React Native Linear Gradient (gradients)
- React Native Curved Bottom Bar (navigation)

**Backend & Database:**
- FastAPI (Python web framework)
- SQLAlchemy (SQL toolkit and ORM)
- PostgreSQL/SQLite (database)
- Pydantic (data validation)
- JWT Authentication
- Alembic (database migrations)

**State Management & Storage:**
- React Context API (Authentication)
- AsyncStorage (local storage)
- JWT Decode (token validation)

**API & Networking:**
- Axios/Fetch (API requests)
- Centralized API Client
- JWT Authentication
- Token expiration handling

**Development Tools:**
- Expo (development platform)
- Metro bundler
- ESLint & Prettier
- Babel transpilation

## 🏗️ Project Structure

```
avowal/
├── 📁 public/                          # Web assets for APK download
│   ├── index.html                      # APK download landing page
│   └── avowal2.0.apk                   # Android application file
│
├── 📁 src/                             # Main application source code
│   ├── 📁 components/                  # Reusable UI components
|   |
│   ├── 📁 context/                     # React Context providers
│   │   └── AuthContext.jsx             # Authentication state management
│   │
│   ├── 📁 navigation/                  # Navigation configuration
│   │   ├── AppNavigator.jsx            # Main navigation controller
│   │   │   ├── Deep linking config     # Password reset URL handling
│   │   │   ├── Token validation        # Authentication routing
│   │   │   └── Navigation switching    # Auth/App stack management
│   │   ├── AuthStack.jsx               # Authentication flow navigation
│   │   │   ├── LoginScreen            # Login page route
│   │   │   ├── SignupScreen           # Registration page route
│   │   │   └── ResetPasswordScreen    # Password reset route
│   │   └── AppStack.jsx                # Main application navigation
│   │       ├── FeedScreen             # Home feed route
│   │       ├── ProfileScreen          # User profile route
│   │       ├── SettingsScreen         # App settings route
│   │       └── MessagesScreen         # Chat/messaging route
│   │
│   ├── 📁 screens/                     # Application screens/pages
│   │   ├── 📁 auth/                    # Authentication screens
│   │   │   ├── LoginScreen.jsx         # User login interface
│   │   │   ├── SignupScreen.jsx        # User registration interface
│   │   │   └── ResetPasswordScreen.jsx # Password reset interface
│   │   │
│   │   ├── 📁 main/                    # Main application screens
│   │   │   ├── FeedScreen.jsx          # Home feed/timeline
│   │   │   ├── ProfileScreen.jsx       # User profile management
│   │   │   ├── SettingsScreen.jsx      # Application settings
│   │   │   └── MessagesScreen.jsx      # Chat/messaging interface
│   │
│   ├── 📁 utils/                       # Utility functions and helpers
│   │
│   ├── 📁 styles/                      # Global styles and themes
│   │
│   ├── 📁 assets/                      # Static assets
│   │   ├── 📁 images/                  # Image files
│   │   ├── 📁 icons/                   # Icon files
│   │   └── 📁 fonts/                   # Custom fonts
│   │
│   └── App.jsx                         # Root application component
│
├── 📁 android/                         # Android-specific configuration
├── 📁 ios/                             # iOS-specific configuration
├── 📄 package.json                     # Dependencies and scripts
├── 📄 metro.config.js                  # Metro bundler configuration
├── 📄 babel.config.js                  # Babel transpilation config
└── 📄 README.md                        # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Expo CLI (optional, for Expo workflow)


## 🏛️ Architecture

### Authentication Flow

1. **Token Storage**: JWT tokens are stored securely using AsyncStorage
2. **Token Validation**: Automatic token expiration checking on app launch
3. **Auto-Logout**: Automatic logout when tokens expire during API calls
4. **Deep Linking**: Support for password reset links

### Navigation Structure

```
AppNavigator
├── AuthStack (Unauthenticated)
│   ├── LoginScreen
│   ├── SignupScreen
│   └── ResetPasswordScreen
└── AppStack (Authenticated)
    ├── FeedScreen
    ├── ProfileScreen
    ├── MessagesScreen
    └── SettingsScreen
```

### State Management

- **AuthContext**: Global authentication state using React Context
- **Local State**: Component-specific state using React hooks
- **AsyncStorage**: Persistent storage for tokens and user preferences

## 🔐 Security Features

- **JWT Token Management**: Secure token storage and validation
- **Automatic Token Expiration**: Handles token expiration gracefully
- **Input Validation**: Client-side validation for all forms
- **API Security**: Centralized API client with authentication headers
- **Deep Link Security**: Secure password reset token validation

## 📱 APK Distribution

The project includes a web-based APK distribution system:

- **Landing Page**: `public/index.html` provides a download interface
- **Automatic Download**: JavaScript-powered APK download functionality  
- **Responsive Design**: Mobile-optimized download experience
- **Version Management**: Easy APK version updates

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build Process

### Android Build

```bash
# Debug build
npm run android

# Release build
cd android && ./gradlew assembleRelease
```

### iOS Build

```bash
# Debug build
npm run ios

# Release build (requires Xcode)
# Open ios/Avowal.xcworkspace in Xcode and build
```

### Expo Build (if using Expo)

```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

## 🚀 Deployment

### APK Distribution
1. Build release APK
2. Place APK in `public/` directory
3. Update `index.html` with new version
4. Deploy to web hosting service

### App Store Deployment
- Follow React Native deployment guides for iOS App Store and Google Play Store

## 🤝 Contributing

Contributions are welcome! Feel free to open issues, submit pull requests, or suggest new features.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add proper error handling for API calls
- Include token expiration checks in authenticated requests
- Write clear commit messages
- Test on both Android and iOS platforms

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Token refresh mechanism needs implementation
- Push notifications not yet integrated
- Image upload optimization needed
- Some UI components need accessibility improvements


## 📞 Support

For support and questions:
- Open an issue in the GitHub repository
- Contact the development team
- Check the documentation for common issues

## 📊 Performance

- **Bundle Size**: Optimized with Metro bundler
- **API Calls**: Debounced search prevents excessive requests  
- **Storage**: Efficient AsyncStorage usage for tokens
- **Navigation**: Optimized stack navigation with lazy loading

---

**Version**: 2.0.0  
**Last Updated**: August 2025  
**Maintainer**: Avowal Development Team  
**Platform**: React Native (Android , iOS)