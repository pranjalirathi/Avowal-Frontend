import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import Header from '../components/Header';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      {/* <View style={styles.headerContainer}> */}
        <Header title="Feed" />
      {/* </View> */}
      <Text style={styles.content}>This is the Feed screen content.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    backgroundColor: 'white', 
  },
  content: {
    fontSize: 16,
    padding: 16,
  },
});
