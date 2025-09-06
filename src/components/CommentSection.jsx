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
  ScrollView,
  Image // Added Image import
} from 'react-native';
import { formatTimeAgo } from "../helpers/formatTimeAgo";
import Icon from "react-native-vector-icons/Feather";
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../constants/api';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const EMOJIS = ['😂', '❤️', '😍', '🔥', '😭', '🤔', '👍', '🙏', '💯', '🎉'];

const CommentsModal = ({ visible, onClose, confession_id }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEmojiPress = (emoji) => {
    setNewComment((prev) => prev + emoji);
  };

  const { userToken } = useContext(AuthContext);

  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const MODAL_HEIGHT = 600; 

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, 0);
    })
    .onEnd(() => {
      if (translateY.value > MODAL_HEIGHT / 3) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, { damping: 50 });
      }
    });

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 50 });
    } else {
      translateY.value = withSpring(MODAL_HEIGHT, { damping: 50 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    if (visible && confession_id) {
      fetchComments();
      setNewComment('');
    }
  }, [visible, confession_id]);


  // ------API FOR FETCHING COMMENTS-------
  const fetchComments = async () => {

    if (!confession_id || isNaN(confession_id)) {
      setError("Invalid confession_id:", confession_id);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/comment/${confession_id}`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.message.reverse());
      } else {
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
    const hasProfilePic = item.user && item.user.profile_pic;

    return (
      <View style={styles.commentRow}>
        {/* Profile Icon or Image */}
        {hasProfilePic ? (
          <Image source={{ uri: item.user.profile_pic }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileIcon}>
            <Text style={styles.iconText}>
              {item.user?.username ? item.user.username.charAt(0).toUpperCase() : '@'}
            </Text>
          </View>
        )}

        {/* Comment Details */}
        <View style={styles.commentDetails}>
          <View style={styles.commentHeader}>
            <Text style={styles.username}>{item.user?.username || 'Avowaler'}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(item.created_at)}</Text>
          </View>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.outsideModalArea} />
          </TouchableWithoutFeedback>

          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              {/* Draggable Handle */}
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

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
                <View style={styles.emojiContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always">
                    {EMOJIS.map((emoji, index) => (
                      <TouchableOpacity key={index} onPress={() => handleEmojiPress(emoji)} style={styles.emojiButton}>
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.textInputRow}>
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
                </View>
              </SafeAreaView>
            </Animated.View>
          </GestureDetector>
          </View>
        </GestureHandlerRootView>
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
    height: '90%', 
    maxHeight: 600, 
    minHeight: 300,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#444',
    borderRadius: 2.5,
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
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  /* Profile Icon Fallback */
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#333',
  },
  /* Profile Image */
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  iconText: {
    color: '#E0E0E0',
    fontSize: 18,
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
    borderTopWidth: 1,
    borderColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emojiContainer: {
    paddingBottom: 8,
  },
  emojiButton: {
    paddingHorizontal: 8,
  },
  emojiText: {
    fontSize: 24,
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
