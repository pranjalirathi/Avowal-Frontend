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
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import LogoutModal from "../components/LogoutModal";
import DeleteModal from "../components/DeleteModal";

const ProfileScreen = () => {
  const email = "pranj@edbuxample.com";
  const [fontSize, setFontSize] = useState(18);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
    setLogoutModalVisible(false);
    //func api
  };


  const handleDelete = () => {
    console.log("Account deleted");
    setDeleteModalVisible(false);
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

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* Menu Options */}
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="user" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Edit Username</Text>
                <Text style={styles.menuSubtitle}>iprash05</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.menuItem}>
              <Icon2 name="alternate-email" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Email</Text>
                <Text style={styles.menuSubtitle}>pranjali.2201119ec@iiitbh.ac.in</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="staro" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={[ styles.menuTitle, styles.editMenu ]}>Edit Relationship Status</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="picture" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={[ styles.menuTitle, styles.editMenu ]}>Edit Profile Pic</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setDeleteModalVisible(true)}>
              <Icon name="delete" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={[ styles.menuTitle, styles.editMenu ]}>Delete Account</Text>
              </View>
            </TouchableOpacity>

          </View>

          {/* Logout Button */}
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => setLogoutModalVisible(true)}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <LogoutModal
        modalVisible={logoutModalVisible}
        setModalVisible={setLogoutModalVisible}
        handleLogout={handleLogout}
      />
        <DeleteModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        handleDelete={handleDelete}
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
    top: 2,
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
  // separator: {
  //   height: 1,
  //   backgroundColor: "#444",
  //   marginVertical: 2,
  // },
  menuContainer: {
    marginVertical: 0,
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 2,
  },
  
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    // paddingHorizontal: 0,
    borderBottomWidth: 1,  
    borderBottomColor: "#444",
  },
  
  menuTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#aaa",
  },  
  editMenu: {
    marginTop: 5,
    marginBottom: 5
  },
  button: {
    backgroundColor: "#E94560",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#E94560",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#1E1E1E",
    borderWidth: 0.8,
    borderColor: "#E94560",
  },
});
