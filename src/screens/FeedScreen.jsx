import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import logo from "../../assets/logo.png";

const data = [
  { id: "1", name: "John Doe", email: "john@example.com", username: "abbc", status: "Single", image: require("../../assets/blueuser.png") },
  { id: "2", name: "Jane Smith", email: "jane@example.com", username: "abbc", status: "In a Relationship", image: require("../../assets/blueuser.png") },
];

const FeedScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Find Your Avowaler</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={18} color="#ccc" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedUser(item)} style={styles.userItem}>
            <Image source={item.image} style={styles.avatar} />
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
      />

      {/* Modal for User Profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedUser}
        onRequestClose={() => setSelectedUser(null)}
      >
        <Pressable style={styles.modalContainer} onPress={() => setSelectedUser(null)}>
          <Pressable style={styles.modalContent}>
            <View style={styles.profilePicContainer}>
              <Image source={selectedUser?.image} style={styles.profileImage} />
            </View>
            <Text style={styles.modalStatus}>{selectedUser?.status}</Text>
            <Text style={styles.modalName}>{selectedUser?.name}</Text>
            <Text style={styles.modalEmail}>{selectedUser?.username}</Text>
            <Text style={styles.modalEmail}>{selectedUser?.email}</Text>
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
    marginBottom: 10,
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
    marginTop: 12,
    marginBottom: 10,
    padding: 10,
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
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
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
    marginTop: 18,
  },
  modalStatus: {
    fontSize: 12,
    color: "#E94560",
    marginTop: 5,
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
