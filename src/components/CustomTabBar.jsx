import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput, 
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import { ConfessionsContext } from "../context/ConfessionsContext";
import { BASE_URL } from '../constants/api'
import { Snackbar } from "react-native-paper";
import { ActivityIndicator } from "react-native";

export default function CustomTabBar({ state, descriptors, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confession, setConfession] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [success, setSuccess] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const { userToken } = useContext(AuthContext); 
  const { addNewConfession } = useContext(ConfessionsContext);


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );
  
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  

  const handlePlusPress = () => {
    setErrorMessage("");
    setConfession("");
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false); 
    setConfession(""); 
    setErrorMessage("");
  };

  const postConfession = async (confessionContent) => {
    const API_URL = `${BASE_URL}/confessions`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 
    
    try {
      setErrorMessage("");
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({ content: confessionContent }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        setErrorMessage("Received invalid response from server");
        setLoading(false);
        return false;
      }
      
      if (response.ok) {
        showSuccess("Confession posted successfully!");
        if (responseData.data) {
          // If server returns the created confession
          addNewConfession(responseData.data);
        } else {
          // If server doesn't return the complete data, create a placeholder
          const newConfession = {
            id: Date.now().toString(), // am adding emporary ID until refresh
            content: confessionContent,
            created_at: new Date().toISOString(),
            comments: 0,
          };
          addNewConfession(newConfession);
        }
        
        setModalVisible(false);
        setConfession("");
        setLoading(false);
        return true;
      } else {
        const errorMessage = responseData.detail || "Failed to post confession";
        
        switch (response.status) {
          case 400:
            setErrorMessage(errorMessage);
            break;
          case 401:
            setErrorMessage("Authentication failed. Please log in again.");
            break;
          case 500:
            setErrorMessage("Server error. Your confession couldn't be saved.");
            break;
          default:
            setErrorMessage(errorMessage);
        }
        setLoading(false);
        return false;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        setErrorMessage("Request timed out. Please try again.");
      } else {
        setErrorMessage("Network error. Please check your connection and try again.");
      }
      setLoading(false);
      return false;
    }
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setSnackbarVisible(true);
    
    // Auto-hide the snackbar after 4 seconds
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 4000);
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

  const handlePostConfession = async () => {
    if(confession.trim().length > 0){
      setLoading(true); 
      const success = await postConfession(confession);
      if (success) {
        setModalVisible(false);
        setConfession("");
        triggerRefresh();
      }
      setLoading(false);
    }
    else{
      showSuccess("Confession cannot be empty!");
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      {/* Background shape */}
      {!keyboardVisible && (
      <View style={styles.tabBarBackground} /> )}
      
      {!keyboardVisible && (
      <View style={styles.tabWrapper}>
        <View style={styles.leftContainer}>
          {leftRoutes.map((route, i) => renderTabItem(route, i))}
        </View>
        <View style={styles.rightContainer}>
          {rightRoutes.map((route, i) => renderTabItem(route, i))}
        </View>
      </View>
      )}

      {/* Floating + Button */}
      {!keyboardVisible && (
        <View style={styles.plusButtonContainer}>
          <TouchableOpacity onPress={handlePlusPress} style={styles.plusButton}>
            <Icon name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  onChangeText={(text) => {
                    setConfession(text);
                  }}
                />
              </View>

              {/* Character Count */}
              <Text style={styles.charCount}>
                {charCount}/{MAX_CHAR} characters
              </Text>

              {/* Error Message in Modal */}
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              {/* Post Button */}
              <TouchableOpacity
                style={[styles.postButton, (loading || !confession.trim()) && { backgroundColor: "#ccc" }]}
                disabled={loading || !confession.trim()}
                onPress={handlePostConfession}
              >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.postButtonText}>Post</Text>
                  )}
              </TouchableOpacity>

              {/* Anonymous Note */}
              <Text style={styles.anonymousNote}>
                Your confession will be posted anonymously
              </Text>
            </View>
          </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
      
      {/* Global Snackbar outside of modal */}
      <Snackbar
        style={styles.snackbar}
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000} 
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {success}
      </Snackbar>
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
  modalContainer: {
    width: "90%",
    justifyContent: "center",
  },
  modalOverlay: {
    width: "100%",
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
    width: "90%",
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
    marginBottom: 12,
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
  errorText: {
    color: "#E94560",
    textAlign: "center",
    marginBottom: 10,
  },
  snackbar: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    width: "90%",
    zIndex: 9999,
    elevation: 10,
    backgroundColor: "#333"
  },
});