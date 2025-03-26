import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import LogoutModal from "../components/LogoutModal";

const ProfileScreen = () => {
  const email = "pranj@edbuxample.com";
  const [fontSize, setFontSize] = useState(18);
  const [modalVisible, setModalVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width - 50;

  useEffect(() => {
    if (email.length > 30) {
      setFontSize(14);
    } else {
      setFontSize(18);
    }
  }, [email]);

  const handleLogout = () => {
    console.log("User logged out");
    setModalVisible(false);
    //func api
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <ScrollView style={styles.content}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image source={require("../../assets/prashu.jpg")} style={styles.profileImage} />
          <View style={styles.overlay} />
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>Pranjali Rathi, 21</Text>
            <View style={styles.matchContainer}>
              <Text style={styles.matchText}>Developer</Text>
            </View>
          </View>
        </View>

        {/* Details Container */}
        <View style={styles.detailsContainer}>
          {/* Username */}
          <Text style={styles.detailLabel}>Username</Text>
          <View style={styles.usernameContainer}>
            <Text style={styles.detailValue}>iprash05</Text>
            <TouchableOpacity>
              <Icon name="edit-2" size={18} color="#E94560" style={styles.editIcon} />
            </TouchableOpacity>
          </View>

          {/* Email */}
          <Text style={styles.detailLabel}>Email</Text>
          <View style={styles.emailContainer}>
            <Text style={[styles.detailValue, { fontSize }]} numberOfLines={1}>
              {email}
            </Text>
          </View>

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* Reset Password Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <LogoutModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleLogout={handleLogout}
      />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    color: "#E94560",
    fontWeight: "bold",
    marginTop: 12,
    marginLeft: 14,
    marginBottom: 10,
    padding: 10,
  },
  content: {},
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 350,
    marginBottom: -12,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    top: "48%",
  },
  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  matchContainer: {
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
  },
  matchText: {
    color: "#E94560",
    fontWeight: "bold",
    fontSize: 14,
  },
  detailsContainer: {
    backgroundColor: "#222",
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginBottom: 80,
    height: "100%",
    gap: 4
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editIcon: {
    marginLeft: 8,
    paddingBottom: 2,
  },
  detailLabel: {
    fontSize: 16,
    color: "#aaa",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  detailValue: {
    top: 0,
    marginBottom: 2,
    fontSize: 18,
    color: "#fff",
    flexShrink: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 16,
  },
  button: {
    backgroundColor: "#E94560",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#444",
  },
});
