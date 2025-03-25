import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function CustomTabBar({ state, descriptors, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

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

  return (
    <View style={styles.tabBarContainer}>
      {/* Background shape */}
      <View style={styles.tabBarBackground} />
      {/* <View style={styles.blurContainer}>
      <BlurView
        style={styles.blurView}
        tint="light"
        intensity={40}
      />
      </View> */}

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
          <View style={styles.modalContent}>
            <Text style={{ color: "#000", fontSize: 18, marginBottom: 20 }}>
              This is your custom modal!
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
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
  // blurContainer: {
  //   position: "absolute",
  //   bottom: 0,
  //   left: 10,
  //   right: 10,
  //   height: 70,
  //   borderRadius: 35,
  //   overflow: "hidden", 
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 5 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 6,
  //   elevation: 5,
  // },
  // blurView: {
  //   flex: 1, 
  //   backgroundColor: "rgba(255, 255, 255, 0.2)",
  //   borderWidth: 1,
  //   borderColor: "rgba(255, 255, 255, 0.3)",
  // },
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});

