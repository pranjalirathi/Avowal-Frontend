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
  Image
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

const CommentsModal = ({ visible, onClose, confession_id, onCommentPosted }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const listRef = React.useRef(null);

  const handleEmojiPress = (emoji) => {
    setNewComment((prev) => prev + emoji);
  };

  const { userToken, userInfo } = useContext(AuthContext);

  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const MODAL_HEIGHT = 600;

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        translateY.value = withSpring(MODAL_HEIGHT, {}, () => runOnJS(onClose)());
      } else {
        translateY.value = withSpring(0);
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
        setComments(data.message);
      } else {
        setError(data.detail?.[0]?.msg || "Failed to fetch comments.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------API FOR POSTING A COMMENT ON A CONFESSION-------
  const postComment = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const postCommentResponse = await fetch(`${BASE_URL}/confessions/${confession_id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const newCommentData = await postCommentResponse.json();

      if (postCommentResponse.ok) {
        const profileResponse = await fetch(`${BASE_URL}/profile_data`, {
          headers: {
            "Authorization": `Bearer ${userToken}`
          }
        });
        const profileData = await profileResponse.json();

        if (profileResponse.ok) {
          const commentUser = {
            id: profileData.data.id,
            username: profileData.data.username,
            profile_pic: profileData.data.profile_pic,
          };

          setComments((prevComments) => [
            {
              id: newCommentData.id,
              content: newCommentData.content,
              created_at: new Date(),
              user_id: newCommentData.user_id,
              user: commentUser
            },
            ...prevComments,
          ]);
          setNewComment("");
          if (onCommentPosted) {
            runOnJS(onCommentPosted)(confession_id);
          }
        } else {
          throw new Error("Failed to fetch profile data for comment update.");
        }
      } else {
        setError(newCommentData.detail || "Failed to post comment.");
      }
    } catch (error) {
      console.error("Error during post comment flow:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const hasProfilePic = item.user && item.user.profile_pic;

    return (
      <View style={styles.commentRow}>
        {hasProfilePic ? (
          <Image source={{ uri: item.user.profile_pic }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileIcon}>
            <Text style={styles.iconText}>
              {item.user?.username ? item.user.username.charAt(0).toUpperCase() : '@'}
            </Text>
          </View>
        )}

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

          <Animated.View style={[styles.modalContainer, animatedStyle]}>
            {/* Draggable Handle - Only this area should trigger the gesture */}
            <GestureDetector gesture={gesture}>
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            </GestureDetector>

            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Comments</Text>
            </View>

            {/* Comments List - Now properly scrollable */}
            <View style={styles.commentsContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#E94560" />
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : (
                <FlatList
                  ref={listRef}
                  data={comments}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItem}
                  style={styles.commentsList}
                  contentContainerStyle={[
                    styles.commentsContentContainer,
                    comments.length === 0 && styles.emptyCommentsContainer
                  ]}
                  ListEmptyComponent={<Text style={styles.noCommentsText}>No comments yet</Text>}
                  showsVerticalScrollIndicator={true}
                  bounces={true}
                  nestedScrollEnabled={true}
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
                <TouchableOpacity 
                  style={[styles.sendButton, (!newComment.trim() || loading) && styles.disabledButton]} 
                  onPress={postComment} 
                  disabled={!newComment.trim()}
                >
                  <Icon name="send" style={styles.sendIcon} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    height: '85%',
    maxHeight: 650,
    minHeight: 400,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    minHeight: 40,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#444',
    borderRadius: 2.5,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  commentsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 16,
  },
  commentsList: {
    flex: 1,
  },
  commentsContentContainer: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  emptyCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCommentsText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
  },
  commentRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 5,
    alignItems: 'flex-start',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#333',
  },
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
    lineHeight: 20,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#1E1E1E',
  },
  emojiContainer: {
    paddingBottom: 8,
  },
  emojiButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emojiText: {
    fontSize: 24,
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    color: '#E0E0E0',
  },
  sendButton: {
    marginLeft: 10,
    padding: 8,
  },
  sendIcon: {
    fontSize: 24,
    color: '#E94560',
  },
  disabledButton: {
    opacity: 0.4,
  },
  outsideModalArea: {
    flex: 1,
  },
});

export default CommentsModal;