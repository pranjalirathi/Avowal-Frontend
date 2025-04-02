import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { useState, useEffect, useContext, useCallback } from "react";
import Icon from "react-native-vector-icons/Feather";
import { renderContentWithMentions } from "../helpers/renderContentWithMentions";
import CommentSection from "../components/CommentSection";
import { AuthContext } from "../context/AuthContext";
import { ConfessionsContext } from "../context/ConfessionsContext";
import { BASE_URL } from "../constants/api";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [selectedConfession, setSelectedConfession] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { refreshTimestamp } = useContext(ConfessionsContext);

  const LIMIT=10;
  const { userToken } = useContext(AuthContext);

  const handleOpenComments = (confession) => {
    setSelectedConfession(confession);
    setCommentsVisible(true);
  };

  const handlePostComment = (text) => {
    console.log("New Comment:", text);
  };

  const fetchConfessions = async (pageToFetch = 0, shouldRefresh = false) => {
    // Don't fetch if we're already at the end and it's not a refresh
    if (!hasMore && !shouldRefresh && pageToFetch !== 0) return;
    
    if (pageToFetch === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const skip = pageToFetch * LIMIT;
      const response = await fetch(`${BASE_URL}/confessions?skip=${skip}&limit=${LIMIT}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      const result = await response.json();
      
      if (response.ok) {
        const newConfessions = result.data;
        
        // Check if we've reached the end
        if (newConfessions.length < LIMIT) {
          setHasMore(false);
        }
        
        // If refreshing or first page, replace data
        // Otherwise append data
        if (shouldRefresh || pageToFetch === 0) {
          setConfessions(newConfessions);
          setPage(0);
        } else {
          setConfessions(prev => [...prev, ...newConfessions]);
        }
        
        console.log(`Fetched ${newConfessions.length} confessions for page ${pageToFetch}`);
      } else {
        console.error("Error fetching confessions:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchConfessions();
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    fetchConfessions(0, true);
  }, []);

  useEffect(() => {
    console.log("Refresh timestamp changed:", refreshTimestamp);
    if (refreshTimestamp) {
      console.log("Fetching confessions due to timestamp change");
      fetchConfessions(0, true); // Force refresh from the beginning
    }
  }, [refreshTimestamp]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchConfessions(nextPage);
    }
  }, [loadingMore, hasMore, page]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#E94560" />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  };

  const formatTimeAgo = (timestamp) => {
    const createdAt = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
    } 
    else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } 
    else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } 
    else if (diffInSeconds < 172800) {
      return "Yesterday";
    } 
    else {
      return createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
  };

  const renderConfession = ({ item, index }) => {
    const isLastItem = index === confessions.length - 1;

    const confessionText = item.content || "";
    
    return (
      <View style={[styles.card, isLastItem && { marginBottom: 70 }]}>
        {item.comments > 10 && (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>Trending ❤‍🔥</Text>
          </View>
        )}
        <Text style={styles.confessionText}>
          {renderContentWithMentions(
            confessionText,
            styles.confessionText,
            styles.mentionText
          )}
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.leftRow}>
            <TouchableOpacity
              style={styles.iconRow}
              onPress={() => handleOpenComments(item)}
            >
              <Icon name="message-circle" size={16} color="#E94560" />
              <Text style={styles.commentCount}>{item.comments}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeText}>{formatTimeAgo(item.created_at)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title at the top */}
      <Text style={styles.title}>Confessions</Text>
      
      {loading && page === 0 ? (
         <View style={styles.loaderContainer}>
         <ActivityIndicator size="large" color="#E94560" />
       </View>
      ) : (
        <FlatList
          data={confessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConfession}
          contentContainerStyle={[styles.listContent, {paddingBottom: loadingMore || !hasMore ? 100 : 0} ]}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      {/* Comment Section Modal */}
      <CommentSection
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        comments={selectedConfession?.commentsList || []}
        onPostComment={handlePostComment}
      />
    </SafeAreaView>
  );
};

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
    padding: 10
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  trendingBadge: {
    backgroundColor: "#E94560",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  trendingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  confessionText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mentionText: {
    color: "#E94560"
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentCount: {
    color: "#FFFFFF",
    marginLeft: 6,
    fontSize: 14,
  },
  timeText: {
    color: "#888",
    fontSize: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },  
  footerLoader: {
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default HomeScreen;