import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function ProfileScreen() {
  const [displayName, setDisplayName] = useState("Coder");
  const [email, setEmail] = useState("pranja2011@gmail.com");
  const [username, setUsername] = useState("pranja2011");
  const [bio, setBio] = useState("Hello world! Coding and exploring new ideas");

  const [editingField, setEditingField] = useState(null);

  const isEditing = (field) => editingField === field;

  const toggleEditMode = (field) => {
    if (isEditing(field)) {
      setEditingField(null);
    } else {
      setEditingField(field);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>My Account</Text>

        {/* Display Name Row */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelValueContainer}>
            <Text style={styles.label}>DISPLAY NAME</Text>
            {isEditing("displayName") ? (
              <TextInput
                style={[styles.value, styles.editableValue]}
                value={displayName}
                onChangeText={setDisplayName}
                autoFocus
                underlineColorAndroid="transparent"
              />
            ) : (
              <Text style={styles.value}>{displayName}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => toggleEditMode("displayName")}
          >
            <Icon
              name={isEditing("displayName") ? "check" : "edit"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Email Row */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelValueContainer}>
            <Text style={styles.label}>EMAIL</Text>
            {isEditing("email") ? (
              <TextInput
                style={[styles.value, styles.editableValue]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoFocus
                underlineColorAndroid="transparent"
              />
            ) : (
              <Text style={styles.value}>{email}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => toggleEditMode("email")}
          >
            <Icon
              name={isEditing("email") ? "check" : "edit"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Username Row */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelValueContainer}>
            <Text style={styles.label}>USERNAME</Text>
            {isEditing("username") ? (
              <TextInput
                style={[styles.value, styles.editableValue]}
                value={username}
                onChangeText={setUsername}
                autoFocus
                underlineColorAndroid="transparent"
              />
            ) : (
              <Text style={styles.value}>{username}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => toggleEditMode("username")}
          >
            <Icon
              name={isEditing("username") ? "check" : "edit"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Bio Row */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelValueContainer}>
            <Text style={styles.label}>BIO</Text>
            {isEditing("bio") ? (
              <TextInput
                style={[styles.value, styles.editableValue]}
                value={bio}
                onChangeText={setBio}
                autoFocus
                multiline
                underlineColorAndroid="transparent"
              />
            ) : (
              <Text style={styles.value}>{bio}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => toggleEditMode("bio")}
          >
            <Icon
              name={isEditing("bio") ? "check" : "edit"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
  },
  container: {
    padding: 16,
  },
  heading: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  labelValueContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#ccc",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: "#fff",
  },
  editableValue: {
    borderBottomWidth: 1,
    borderBottomColor: "#4285F4", // Blue underline when editing
  },
  iconButton: {
    marginLeft: 16,
    padding: 6,
  },
});
