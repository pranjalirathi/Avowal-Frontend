import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

const ComingSoonScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
    
      <Text style={styles.title}>Notifications </Text>

      <View style={styles.content}>
        <Text style={styles.comingSoonText}>COMING SOON</Text>
        <Text style={styles.description}>
          We're working hard to bring you something amazing.
        </Text>
        <View style={styles.underline} />
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 70
  },
  comingSoonText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E94560",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
  },
  underline: {
    width: width * 0.1,
    height: 2,
    backgroundColor: "#E94560",
    marginTop: 8,
  },
});

export default ComingSoonScreen;
