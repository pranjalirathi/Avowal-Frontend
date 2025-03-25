import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function CustomTabBar({ state, descriptors, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confession, setConfession] = useState("");

  const handlePlusPress = () => {
    setModalVisible(true);
  };

  const leftRoutes = state.routes.slice(0, 2);   // [Home, Feed]
  const rightRoutes = state.routes.slice(2);     // [Settings, Profile]

  // Helper to render each tab icon
  const renderTabItem = (route, index) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === state.routes.indexOf(route);

    // Determine icon name based on route
    let iconName = "circle";
    switch (route.name) {
      case "Home":
        iconName = "home";
        break;
      case "Feed":
        iconName = "clock";
        break;
      case "Settings":
        iconName = "settings";
        break;
      case "Profile":
        iconName = "user";
        break;
      default:
        iconName = "circle";
    }

    // Handle tab press
    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        style={styles.tabItem}
        onPress={onPress}
      >
        <Icon
          name={iconName}
          size={24}
          color={isFocused ? "#E94560" : "#888"}
        />
      </TouchableOpacity>
    );
  };

  const charCount = confession.length;
  const MAX_CHAR = 100;

  const handlePostConfession = () => {
    console.log("Confession posted:", confession);
    setModalVisible(false);
    setConfession("");
  };

  return (
    <View style={styles.tabBarContainer}>
      {/* Background shape */}
      <View style={styles.tabBarBackground} />

      {/* A row that holds two sub-containers: left & right */}
      <View style={styles.tabWrapper}>
        {/* Left icons */}
        <View style={styles.leftContainer}>
          {leftRoutes.map((route, i) => renderTabItem(route, i))}
        </View>

        {/* Right icons */}
        <View style={styles.rightContainer}>
          {rightRoutes.map((route, i) => renderTabItem(route, i))}
        </View>
      </View>

      {/* Floating '+' button in the center */}
      <View style={styles.plusButtonContainer}>
        <TouchableOpacity onPress={handlePlusPress} style={styles.plusButton}>
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Simple Modal triggered by '+' */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {/* The card-like modal content */}
            <View style={styles.postCard}>
              {/* Header Row */}
              <View style={styles.headerRow}>
                <Icon name="heart" size={20} color="#E94560" />
                <Text style={styles.headerTitle}> Post Your Confession</Text>
              </View>

              <View style={styles.separator} />


              {/* Text Input for the Confession */}
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="What's in your heart? Type your confession here..."
                  placeholderTextColor="#aaa"
                  multiline
                  maxLength={MAX_CHAR}
                  value={confession}
                  onChangeText={setConfession}
                />
              </View>

              {/* Character Count */}
              <Text style={styles.charCount}>
                {charCount}/{MAX_CHAR} characters
              </Text>

              {/* Post Button */}
              <TouchableOpacity
                style={styles.postButton}
                onPress={handlePostConfession}
              >
                <Text style={styles.postButtonText}>
                  Post Confession
                </Text>
              </TouchableOpacity>

              {/* Anonymous Note */}
              <Text style={styles.anonymousNote}>
                Your confession will be posted anonymously
              </Text>

            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    height: 70,
    alignItems: "center",
  },
  tabBarBackground: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
    height: 70,
    backgroundColor: "#1a1a1a",
    borderRadius: 35,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 5,
  },
  tabWrapper: {
    flexDirection: "row",
    width: "100%",
    height: 70,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20, 
  },
  leftContainer: {
    flexDirection: "row",
  },
  rightContainer: {
    flexDirection: "row",
  },
  tabItem: {
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  plusButtonContainer: {
    position: "absolute",
    bottom: 35, 
    alignSelf: "center",
    alignItems: "center",
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E94560",
    alignItems: "center",
    justifyContent: "center",
    // Extra shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postCard: {
    width: "80%",
    backgroundColor: "rgba(26, 26, 26, 1)",
    borderRadius: 10,
    padding: 20,
    alignSelf: "center",
    // modal border
    // borderWidth: 0.5,
    // borderColor: "#E94560",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 30,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E94560",
    marginLeft: 5,
    marginBottom: 5,
  },
  textInputContainer: {
    backgroundColor: "rgba(26, 26, 26, 1)",
    borderRadius: 8,
    padding: 2,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E94560",
  },
  textInput: {
    height: 80,
    textAlignVertical: "top", 
    color: "#333",
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    alignSelf: "flex-end"
  },
  postButton: {
    backgroundColor: "#E94560",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  anonymousNote: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginBottom: 5,
  },
});

