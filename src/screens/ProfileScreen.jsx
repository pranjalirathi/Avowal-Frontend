import { useState, useEffect, useContext } from "react";
import { SafeAreaView, Text, StyleSheet, Image, ScrollView, View, TouchableOpacity, Dimensions, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { Snackbar } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import LogoutModal from "../components/LogoutModal";
import DeleteModal from "../components/DeleteModal";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from "../constants/api";
import logo from "../../assets/avowal.png";


const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout, userToken } = useContext(AuthContext);

  useEffect(() => {
    if (!userToken) {
      navigation.replace("SignupScreen");
    }
  }, [userToken]);

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");

  const [fontSize, setFontSize] = useState(18);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width - 50;

  // ------API FOR USER PROFILE DATA RENDERING--------
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/profile_data`, {
          headers: {
            "Authorization": `Bearer ${userToken}`
          }
        });
        const json = await response.json();
        if (response.ok) {
          let imageUrl = json.data.profile_pic;
          if (!imageUrl.startsWith("http")) {
            imageUrl = `${BASE_URL}/${imageUrl}`;
          }

          setProfileData({ ...json.data, profile_pic: imageUrl });
        } else {
          showError(json.message || "Error fetching profile data.");
        }
      } catch (error) {
        showError("Error fetching profile data.");
      } finally {
        setLoadingProfile(false);
      }
    };

  useEffect(() => {
    fetchProfileData();
  }, [userToken]);
  

  const showError = (message) => {
    setError(message);
    setSnackbarVisible(true);
  };

  const showSuccess = (message) => {
    setError(null); 
    setSuccess(message);
    setSnackbarVisible(true);
  };
  

  useEffect(() => {
    if (profileData && profileData.email && profileData.email.length > 30) {
      setFontSize(14);
    } else {
      setFontSize(18);
    }
  }, [profileData]);



  //----------- API FOR UPDATING USERNAME------------
  const handleUsernameChange = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setIsEditing(false);
      return;
    }

  const previousUsername = profileData.username;
  
  setProfileData((prevData) => ({
    ...prevData,
    username: trimmedUsername
  }));

  setUsername(trimmedUsername);

  try {
    const queryParams = new URLSearchParams({ username: trimmedUsername }).toString();
    const url = `${BASE_URL}/update?${queryParams}`;


    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    showSuccess("Username updated successfully!");

    const json = await response.json();

    if (!response.ok) {
      // If API fails, revert UI
      showError(json.detail || "Error updating username.");

      setProfileData((prevData) => ({
        ...prevData,
        username: previousUsername,
      }));
  
    }
  } catch (error) {
    setProfileData((prevData) => ({
      ...prevData,
      username: previousUsername,
    }));
    showError("Error updating username.");

    setProfileData((prevData) => ({
      ...prevData,
      username: previousUsername,
    }));
  } finally {
    setIsEditing(false);
  }
};
 

  // ----------API FOR UPDTAING STATUS-------------
  const handleStatusChange = async (status) => {

    const previousStatus = profileData.relationship_status;

    setProfileData((prevData) => ({
      ...prevData,
      relationship_status: status,
    }));
  
    try {
      const queryParams = new URLSearchParams({ relationship_status: status }).toString();
      const url = `${BASE_URL}/update?${queryParams}`;
  
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      const json = await response.json();
  
      if (!response.ok) {
        showError(json.detail || json.message || "Error updating status.");
        setProfileData((prevData) => ({
          ...prevData,
          relationship_status: previousStatus, 
        }));
      }
    } catch (error) {
      showError("Error updating status.");

      // If let say the request fails, i will revert back the ui  
      setProfileData((prevData) => ({
        ...prevData,
        relationship_status: previousStatus, 
      }));
    }
  };


  // --------------API FOR CHANGING PROFILE PIC--------------
  const handleChangeProfilePic = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      alert("Permission to access media is required!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const image = result.assets[0];
      uploadImage(image); 
    }
  };

  const uploadImage = async (image) => {
    setUploading(true); 
    
    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,
      name: image.fileName || "profile.jpg",
      type: image.mimeType || "image/jpeg",
    });
    
    try {
      const response = await fetch(`${BASE_URL}/update_profile_pic`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.data?.url) {
        await fetchProfileData();
        showSuccess("Profile picture updated successfully!");
      } else {
        showError(result.message || "Failed to update profile picture");
      }
    } catch (err) {
      showError("Error updating profile picture");
    } finally {
      setUploading(false);
      setSnackbarVisible(true);
    }
  };
   

  const handleLogout = () => {
    logout();
    setLogoutModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/delete_user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (res.ok) {
        const data = await res.json(); 
        showSuccess("Account deleted successfully!");
        await logout();
  
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "SignupScreen" }],
          });
        }, 300);
      } else {
        const errorText = await res.text();
        let message = "Failed to delete account.";
        try {
          const json = JSON.parse(errorText);
          message = json.message || message;
        } catch (e) {
          message = errorText;
        }
        showError(message);
        }
    } catch (err) {
      showError("Network error. Please try again later.");
    }
  };
  
  if (loadingProfile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E94560" />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Profile</Text>
      </View>
      <ScrollView style={styles.content}>

        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image 
          source={{ uri: profileData?.profile_pic }} 
          style={styles.profileImage} />

          <View style={styles.permanentOverlay} />

          {uploading && (
              <View style={styles.spinnerOverlay}>
                <ActivityIndicator size="large" color="#E94560" />
              </View>
            )}

          {snackbarVisible && <View style={styles.overlay} />}
            <View style={styles.infoContainer}>
              <Text style={[styles.userName]}>{profileData ? profileData.name : "User Name"}</Text>
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

          {/* Showing ssnackbar  */}
          <View style={{ flex: 1, justifyContent: "center" }}>
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
              {error || success}
            </Snackbar>
          </View>

          <View style={styles.menuItem}>
            

            <Icon name="user" size={20} color="#E94560" />
            <View style={styles.menuTextContainer}>
              {isEditing ? (
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  autoFocus
                  onBlur={handleUsernameChange}
                  style={styles.input}
                />
                ) : (
                  <Text style={styles.menuSubtitle}>{profileData.username}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() =>{setUsername(profileData.username); setIsEditing(true)}}>
                <Icon2 name="edit" size={18} color="#E94560" style={styles.editIcon} />
              </TouchableOpacity>
            </View>


            <View style={styles.menuItem}>
              <Icon name="mail" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuSubtitle, styles.editMenu]}>{profileData ? profileData.email : ""}</Text>
              </View>
            </View>

          <View style={styles.menuItem}>
            <Icon name="staro" size={20} color="#E94560" />
            <View style={styles.menuTextContainer}>

              <View style={styles.badgeContainer}>
                {["Single", "Committed"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[styles.badge, profileData.relationship_status === status ? styles.selectedBadge : styles.unselectedBadge,
                    ]}
                    onPress={() => handleStatusChange(status)}
                  >
                    <Text style={styles.badgeText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              </View>
            </View>

            {/* Profile Pic Section */}
            <TouchableOpacity style={styles.menuItem} onPress={handleChangeProfilePic}>
              <Icon name="picture" size={20} color="#E94560" />
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, styles.editMenu, { color: uploading ? "#aaa" : "#fff" }]}>
                  {uploading ? "Uploading..." : "Change Profile Pic"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Delete Account Section */}
            <TouchableOpacity style={styles.menuItem} onPress={() => setDeleteModalVisible(true)} disabled={loadingProfile}>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16
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
    zIndex: 2
  },
  userName: {
    color: "#fff",
    fontSize: 28,
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
    padding: 18,
    top: 0,
    zIndex: 4,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginBottom: 90,
    height: "100%",
    gap: 0
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
    fontSize: 16,
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
  editIcon: {
    marginLeft: 8,
    paddingBottom: 2,
  },
  relationshipContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  selectedBadge: {
    backgroundColor: "#E94560",
  },
  unselectedBadge: {
    backgroundColor: "#444",
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 10, 
    marginTop: 6,
  },
  
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  input: {
  borderWidth: 1,
  borderColor: "#444",
  borderRadius: 8,
  padding: 8,
  color: "#fff",
},
  snackbar: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    transform: [{ translateY: -50 }],
    width: "100%",
    zIndex: 9999,
    elevation: 10,
    backgroundColor: "#333"
  },
  spinnerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    color: "#E94560",
    backgroundColor: "rgba(0, 0, 0, 0.4)", 
    zIndex: 10,
  },
  permanentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)", 
    zIndex: 1, 
  },
});
