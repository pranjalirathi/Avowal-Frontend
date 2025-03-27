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
import Icon from "react-native-vector-icons/Ionicons";

export default function CustomTabBar({ state, descriptors, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confession, setConfession] = useState("");

  const handlePlusPress = () => {
    setModalVisible(true);
  };

  const leftRoutes = state.routes.slice(0, 2);   
  const rightRoutes = state.routes.slice(2);    

  const renderTabItem = (route, index) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === state.routes.indexOf(route);

    let iconName;
    switch (route.name) {
      case "Home":
        iconName = isFocused ? "home" : "home-outline";
        break;
      case "Feed":
        iconName = isFocused ? "search" : "search-outline";
        break;
      case "Notification":
        iconName = isFocused ? "notifications" : "notifications-outline";
        break;
      case "Profile":
        iconName = isFocused ? "person" : "person-outline";
        break;
      default:
        iconName = isFocused ? "ellipse" : "ellipse-outline";
    }

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
  const MAX_CHAR = 350;

  const handlePostConfession = () => {
    console.log("Confession posted:", confession);
    setModalVisible(false);
    setConfession("");
  };

  return (
    <View style={styles.tabBarContainer}>
      {/* Background shape */}
      <View style={styles.tabBarBackground} />

      <View style={styles.tabWrapper}>
        <View style={styles.leftContainer}>
          {leftRoutes.map((route, i) => renderTabItem(route, i))}
        </View>
        <View style={styles.rightContainer}>
          {rightRoutes.map((route, i) => renderTabItem(route, i))}
        </View>
      </View>

      {/* Floating '+' button  */}
      <View style={styles.plusButtonContainer}>
        <TouchableOpacity onPress={handlePlusPress} style={styles.plusButton}>
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/*  Modal*/}
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
                <Text style={styles.headerTitle}>Confess</Text>
              </View>

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
                  Post
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
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 20,
    marginTop: 20,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E94560",
    marginLeft: 5,
  },
  textInputContainer: {
    backgroundColor: "rgba(26, 26, 26, 1)",
    borderRadius: 8,
    padding: 1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E94560",
  },
  textInput: {
    height: 80,
    textAlignVertical: "top", 
    color: "#E0E0E0",
    paddingBottom: 0,
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
    alignSelf: "flex-end",
    marginTop: -5
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

