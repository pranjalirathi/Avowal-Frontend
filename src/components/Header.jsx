import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Header({ title }) {
  return (
    <View style={styles.header}>
      <Image 
        source={require('../../assets/avatar.jpg')} // Update with your logo path
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'red', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Adjust text color as needed
  },
});
