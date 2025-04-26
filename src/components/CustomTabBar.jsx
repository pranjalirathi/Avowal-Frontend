import React, { useState, useContext, useEffect, useRef } from "react";
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
  Keyboard,
  ScrollView,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import { ConfessionsContext } from "../context/ConfessionsContext";
import BASE_URL from '../constants/api'
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
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
  const textInputRef = useRef(null);

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
  
  useEffect(() => {
    if (!modalVisible) {
      setMentionSuggestions([]);
      setShowSuggestions(false);
      setMentionQuery("");
    }
  }, [modalVisible]);

  const handlePlusPress = () => {
    setErrorMessage("");
    setConfession("");
    setMentionSuggestions([]);
    setShowSuggestions(false);
    setMentionQuery("");
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false); 
    setConfession(""); 
    setErrorMessage("");
    setMentionSuggestions([]);
    setShowSuggestions(false);
    setMentionQuery("");
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
            id: Date.now().toString(), // temporary ID until refresh
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

  const handleSelectionChange = (event) => {
    setCursorPosition(event.nativeEvent.selection);
  };

  const handleConfessionChange = async (text) => {
    setConfession(text);
  
    const mentionRegex = /@(\w*)$/;
    const match = text.slice(0, cursorPosition.start || text.length).match(mentionRegex);
  
    if (match) {
      const query = match[1];
      setMentionQuery(query);
      setShowSuggestions(true);
      fetchSuggestions(query);
    } else {
      setShowSuggestions(false);
      setMentionQuery("");
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(`${BASE_URL}/search_users?q=${query}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await res.json();
      setMentionSuggestions(data.data);
    } catch (error) {
      console.error("Error fetching mentions", error);
    }
  };

  const handleSelectMention = (username) => {
    const beforeCursor = confession.slice(0, cursorPosition.start);
    const afterCursor = confession.slice(cursorPosition.end);
    
    const updatedBeforeCursor = beforeCursor.replace(/@(\w*)$/, `@${username} `);
    const updatedText = updatedBeforeCursor + afterCursor;
    
    setConfession(updatedText);
    setShowSuggestions(false);
    
    const newPosition = updatedBeforeCursor.length;
    
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
        textInputRef.current.setNativeProps({
          selection: { start: newPosition, end: newPosition }
        });
      }
    }, 10);
  };

  const getProfileImageUrl = (profile_pic) => {
    if (!profile_pic) return null;
    return profile_pic.includes('http') ? profile_pic : `${BASE_URL}/${profile_pic}`;
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
  const MAX_CHAR = 200;

  const handlePostConfession = async () => {
    if(confession.trim().length > 0){
      setLoading(true); 
      const success = await postConfession(confession);
      if (success) {
        setModalVisible(false);
        setConfession("");
        if (typeof triggerRefresh === 'function') {
          triggerRefresh();
        }
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
                  ref={textInputRef}
                  style={styles.textInput}
                  placeholder="What's in your heart? Type your confession here..."
                  placeholderTextColor="#aaa"
                  multiline
                  maxLength={MAX_CHAR}
                  value={confession}
                  onChangeText={handleConfessionChange}
                  onSelectionChange={handleSelectionChange}
                />
                {showSuggestions && mentionSuggestions.length > 0 && (
                  <View style={styles.suggestionBox}>
                    <ScrollView 
                      style={styles.suggestionScroll}
                      keyboardShouldPersistTaps="handled"
                    >
                      {mentionSuggestions.map((user, idx) => (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => handleSelectMention(user.username)}
                          style={styles.suggestionItem}
                        >
                          {user.profile_pic && (
                            <Image 
                              source={{ uri: getProfileImageUrl(user.profile_pic) }}
                              style={styles.profileImage}
                              // defaultSource={require('../assets/default-avatar.png')} // Add a default image in your assets
                            />
                          )}
                          <Text style={styles.usernameText}>@{user.username}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
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
    padding: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E94560",
    position: "relative",
  },
  textInput: {
    height: 80,
    textAlignVertical: "top", 
    color: "#E0E0E0",
    paddingBottom: 0,
    paddingHorizontal: 10,
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
  suggestionBox: {
    position: "absolute",
    top: 80, // position right below the text input
    left: 0,
    right: 0,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
    zIndex: 1000,
    maxHeight: 150,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionScroll: {
    maxHeight: 150,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: "#333" // placeholder color while loading
  },
  usernameText: {
    color: "#E0E0E0",
    fontSize: 14,
  }
});