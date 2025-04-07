import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import logo from "../../assets/avowal.png";
import { BASE_URL } from "../constants/api";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const FeedScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null); 
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const { userToken } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      setSearchQuery("");
      setFilteredData([]);
      return () => {}; 
    }, [])
  );
  
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setFilteredData([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/search_users?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.data) {
        const transformedData = data.data.map((user, index) => {
          let imageUrl = user.profile_pic;
          if (imageUrl && !imageUrl.startsWith("http")) {
            imageUrl = `${BASE_URL}/${imageUrl}`;
          }
          return {
            id: user.username || String(index),
            name: user.name || "No Name",
            email: user.email || "No Email",
            username: user.username || "",
            status: user.status || "No Status",
            image: imageUrl || null
          }
      });

        setFilteredData(transformedData);
      } else {
        setFilteredData([]);
      }
    } catch (err) {
      setError("Failed to search users. Please try again.");
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  
  const debouncedSearch = useCallback(debounce(searchUsers, 500), [userToken]);

  // As input change handling function
  const handleSearch = (text) => {
    const lowerCaseQuery = text.toLowerCase();
    setSearchQuery(lowerCaseQuery);
    debouncedSearch(lowerCaseQuery);
  };

  const fetchUserProfile = async (username) => {
    if (!username) return;
    setIsProfileLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/user?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserDetails(data.data); 
    } catch (err) {
      setUserDetails(null);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleUserPress = (user) => {
    setSelectedUser(user);
    fetchUserProfile(user.username); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Find Your Avowaler</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={18}
          color="#ccc"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#E94560" />
        </View>
      )}

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleUserPress(item)} 
            style={styles.userItem}
          >
            <Image
              source={
                typeof item.image === "string" ? { uri: item.image } : item.image
              }
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.usernameText}>@{item.username}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isLoading && !error && searchQuery.trim() !== "" ? (
            <Text style={styles.emptyText}>No results found</Text>
          ) : null
        }
      />

      {/* Modal for User Profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedUser}
        onRequestClose={() => setSelectedUser(null)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setSelectedUser(null)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {isProfileLoading ? (
              <ActivityIndicator size="large" color="#E94560" />
            ) : userDetails ? (
            <>
              <View style={styles.profilePicContainer}>
                <Image
                  source={
                    typeof selectedUser?.image === "string"
                      ? { uri: selectedUser?.image }
                      : selectedUser?.image
                  }
                  style={styles.profileImage}
                />
              </View>
              <Text style={styles.modalStatus}>{userDetails?.relationship_status || "N/A"}</Text>
              <Text style={styles.modalName}>{userDetails?.name || "No Name"}</Text>
              <Text style={styles.modalEmail}>@{userDetails?.username}</Text>
              <Text style={styles.modalEmail}>{userDetails?.email}</Text>
            </>
            ) : (
              <Text style={styles.errorText}>Failed to load profile</Text>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 3,
    borderRadius: 25,
  },
  title: {
    fontSize: 24,
    color: "#E94560",
    fontWeight: "bold",
    marginVertical: 16,
    marginTop: 8,
    marginBottom: 5,
    padding: 10
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  loaderContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  errorText: {
    color: "#E94560",
    textAlign: "center",
    marginTop: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  userInfo: {
    flexDirection: "column",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 12,
  },
  itemText: {
    color: "#fff",
    fontSize: 16,
  },
  usernameText: {
    color: "#ccc",
    fontSize: 14,
  },
  emptyText: {
    color: "#E94560",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#1E1E1E",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  profilePicContainer: {
    position: "absolute",
    top: -40,
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  modalName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
  },
  modalStatus: {
    fontSize: 12,
    color: "#E94560",
    marginTop: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 35,
    backgroundColor: "#333",
  },
  modalEmail: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 5,
  },
});

export default FeedScreen;
