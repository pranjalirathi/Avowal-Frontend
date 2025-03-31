import { useState, useEffect, useContext } from "react";
import { SafeAreaView, Text, StyleSheet, Image, ScrollView, View, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import LogoutModal from "../components/LogoutModal";
import DeleteModal from "../components/DeleteModal";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';
import BASE_URL from "../constants/api";


const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout, userToken } = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  const [fontSize, setFontSize] = useState(18);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width - 50;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("https://avowal-backend.vercel.app/profile_data", {
          headers: {
            "Authorization": `Bearer ${userToken}`
          }
        });
        const json = await response.json();
        if (response.ok) {
          console.log(json.data);
          setProfileData(json.data);
        } else {
          setError(json.message || "Error fetching profile data.");
          console.error("Profile fetch error:", json.message);
        }
      } catch (error) {
        setError("Error fetching profile data.");
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfileData();
  }, [userToken]);

  useEffect(() => {
    if (profileData && profileData.email && profileData.email.length > 30) {
      setFontSize(14);
    } else {
      setFontSize(18);
    }
  }, [profileData]);

  const handleLogout = () => {
    console.log("before logout");
    logout();
    setLogoutModalVisible(false);
    console.log("after logout");
  };

  const handleDelete = () => {
    console.log("Account deleted");
    setDeleteModalVisible(false);
  };

  if (loadingProfile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E94560" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <ScrollView style={styles.content}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={profileData && profileData.profile_pic ? { uri: `${BASE_URL}/${profileData.profile_pic}` } : require("../../assets/prashu.jpg")}
            style={styles.profileImage}
          />
          <View style={styles.overlay} />
          <View style={styles.infoContainer}>
            <Text style={[styles.userName, { fontSize }]}>{profileData ? profileData.name : "User Name"}</Text>
            <View style={styles.matchContainer}>
              <Text style={styles.matchText}>{profileData ? profileData.relationship_status : "Status"}</Text>
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
                <Text style={styles.menuSubtitle}>{profileData ? profileData.username : ""}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.menuItem}>
              <Icon2 name="alternate-email" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Email</Text>
                <Text style={styles.menuSubtitle}>{profileData ? profileData.email : ""}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="staro" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, styles.editMenu]}>Edit Relationship Status</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="picture" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, styles.editMenu]}>Edit Profile Pic</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setDeleteModalVisible(true)}>
              <Icon name="delete" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, styles.editMenu]}>Delete Account</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  errorText: {
    color: "#E94560",
    fontSize: 18,
    padding: 20,
    textAlign: "center",
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
