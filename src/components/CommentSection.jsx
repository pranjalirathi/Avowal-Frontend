import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import comments from '../constants/commentsData'; 
import Icon from "react-native-vector-icons/Feather";

const CommentsModal = ({ visible, onClose }) => {
  const [newComment, setNewComment] = useState('');

  const renderItem = ({ item }) => {
    return (
      <View style={styles.commentRow}>
        {/* Profile Icon */}
        <View style={styles.profileIcon}>
          <Text style={styles.iconText}>@</Text>
        </View>

        {/* Comment Details */}
        <View style={styles.commentDetails}>
          <View style={styles.commentHeader}>
            <Text style={styles.username}>Avowaler</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* Dark overlay */}
      <View style={styles.modalOverlay}>
        {/* Modal Container */}
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Comments</Text>
          </View>

          {/* Comments List */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.commentsList}
          />

          {/* Input Section */}
          <SafeAreaView style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#999"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Icon name="send" style={styles.sendIcon} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  /* Opaque background for dim */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  /* Main container of the modal */
  modalContainer: {
    backgroundColor: '#1E1E1E',
    maxHeight: '80%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  /* Header */
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#888',
  },
  headerText: {
    padding: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  commentsList: {
    paddingHorizontal: 10,
  },
  /* Each comment row */
  commentRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  /* Profile Icon */
  profileIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    bottom: 8
  },
  iconText: {
    color: '#E94560',
    fontSize: 32,
    fontWeight: 'bold',
  },
  commentDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontWeight: 'bold',
    marginRight: 6,
    color: "#B3B3B3"
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  /* Input Section at bottom */
  inputContainer: {
    flexDirection: 'row',
    // borderTopWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#E0E0E0',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: '#E0E0E0',
  },
  sendButton: {
    marginLeft: 10,
    bottom: 5
  },
  sendIcon: {
    fontSize: 24,
    color: '#E94560',
    font: 'bold',
    paddingTop: 2,
    paddingRight: 7
  },
});

export default CommentsModal;
