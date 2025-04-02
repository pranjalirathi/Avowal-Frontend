import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { formatTimeAgo } from "../helpers/formatTimeAgo";
import comments from '../constants/commentsData'; 
import Icon from "react-native-vector-icons/Feather";
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../constants/api';

const CommentsModal = ({ visible, onClose, confession_id }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    if (visible && confession_id) {
      fetchComments();
    }
  }, [visible, confession_id]);


  // ------API FOR FETCHING COMMENTS-------
  const fetchComments = async () => {

    if (!confession_id || isNaN(confession_id)) {
      console.error("Invalid confession_id:", confession_id);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/comment/${confession_id}`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.message);
      } else {
        console.error("Failed to fetch comments:", data);
        setError(data.detail?.[0]?.msg || "Failed to fetch comments.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  // ------API FOR POSING A COMMENT ON A CONFESSION-------
  const postComment = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
  
    setError(null);
    setLoading(true);
  
    try {
      const response = await fetch(`${BASE_URL}/confessions/${confession_id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Add new comment to the list without fetching again
        setComments((prevComments) => [
          { id: data.id, content: data.content, created_at: new Date(), user_id: data.user_id },
          ...prevComments,
        ]);
        setNewComment("");
      } else {
        setError(data.detail || "Failed to post comment.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  


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
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Text style={styles.username}>Avowaler</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(item.created_at)}</Text>
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

      <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.outsideModalArea} />
      </TouchableWithoutFeedback>
          {/* Modal Container */}
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Comments</Text>
            </View>

            {/* Comments List */}
            <View style={styles.commentsContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#E94560" style={styles.loader} />
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              style={styles.commentsList}
              contentContainerStyle={comments.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : null}
              ListEmptyComponent={<Text style={styles.noCommentsText}>No comments yet</Text>}
            />
          )}
          </View>

            {/* Input Section */}
            <SafeAreaView style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                placeholderTextColor="#999"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity style={[styles.sendButton, (!newComment.trim() || loading) && styles.disabledButton]} onPress={postComment} disabled={!newComment.trim()}>
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
    // flex: 1,
    backgroundColor: '#1E1E1E',
    height: '90%', 
    maxHeight: 600, 
    minHeight: 300,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 5
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
  loader: {
    marginVertical: 20,
    alignSelf: "center",
  },
  noCommentsText: {
    textAlign: "center",
    color: "#999",
    paddingVertical: 20,
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
    // maxHeight: 60
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
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginVertical: 10,
  },
  disabledButton: {
    opacity: 0.4, 
  },  
  commentsContainer: {
    flex: 1,
  },
  commentsList: {
    flexGrow: 0,
  },
  outsideModalArea: {
    flex: 1,
  },
  
});

export default CommentsModal;
