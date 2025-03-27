import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import logo from "../../assets/logo.png";

const data = [
  { id: "1", name: "John Doe", image: require("../../assets/blueuser.png") },
  { id: "2", name: "Jane Smith", image: require("../../assets/blueuser.png") },
  { id: "3", name: "Alice Johnson", image: require("../../assets/blueuser.png") },
  { id: "4", name: "Bob Brown", image: require("../../assets/blueuser.png") },
];

const FeedScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

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

      <View style={styles.usersContainer}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Image source={item.image} style={styles.avatar} />
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
        />
      </View>

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
    borderRadius: 25
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
  usersContainer: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
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
});

export default FeedScreen;
