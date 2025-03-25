import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather"; 

const Alert = ({ type = "success", message, onClose }) => {
  const bgColor = type === "success" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)";
  const textColor = type === "success" ? "#34D399" : "#EF4444";
  const iconName = type === "success" ? "check-circle" : "x-circle";

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <View style={[styles.alertContainer, { backgroundColor: bgColor, borderColor: textColor }]}>
      <Icon name={iconName} size={24} color={textColor} />
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={[styles.closeButton, { color: textColor }]}>✖</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: "absolute",
    top: 50,
    left: "10%",
    right: "10%",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  message: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  closeButton: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Alert;
