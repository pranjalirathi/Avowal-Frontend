import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Image
} from "react-native";
import { useState, useEffect, useContext, useCallback , useRef} from "react";
import Icon from "react-native-vector-icons/Feather";
import { renderContentWithMentions } from "../helpers/renderContentWithMentions";
import { formatTimeAgo } from "../helpers/formatTimeAgo";
import CommentSection from "../components/CommentSection";
import { AuthContext } from "../context/AuthContext";
import { ConfessionsContext } from "../context/ConfessionsContext";
import BASE_URL from "../constants/api";
import logo from "../../assets/avowal.png";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [selectedConfessionId, setSelectedConfessionId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { newConfessions, clearNewConfessions } = useContext(ConfessionsContext);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);

  const LIMIT=10;
  const { userToken , logout } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      handleRefresh();

      return () => {
      };
    }, [])
  );

  useEffect(() => {
    fetchConfessions();
  }, []);

  const handleOpenComments = (confession) => {
    setSelectedConfessionId(confession.id);
    setCommentsVisible(true);
  };

  const handleCommentPosted = (confessionId) => {
    setConfessions(prevConfessions => 
      prevConfessions.map(confession => {
        if (confession.id === confessionId) {
          return {
            ...confession,
            comments_count: (confession.comments_count || 0) + 1
          };
        }
        return confession;
      })
    );
  };

  useEffect(() => {
    if (newConfessions.length > 0) {
      //will merge the new fetched with the previous
      setConfessions(prevConfessions => {
        const existingIds = new Set(prevConfessions.map(c => c.id));
        const uniqueNewConfessions = newConfessions.filter(c => !existingIds.has(c.id));
        
        // id at top, then we will add new confessions to the top of the list
        if (uniqueNewConfessions.length > 0) {
          const updatedConfessions = [...uniqueNewConfessions, ...prevConfessions];
          
          // Scroll to top to show new confessions if needed
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            }
          }, 100);
          
          return updatedConfessions;
        }
        
        return prevConfessions;
      });
      
      // clear context after merging
      clearNewConfessions();
    }
  }, [newConfessions, clearNewConfessions]);

  const fetchConfessions = async (pageToFetch = 0, shouldRefresh = false) => {
    // Don't fetch if we're already at the end and it's not a refresh
    if (!hasMore && !shouldRefresh && pageToFetch !== 0) return;
    
    if (pageToFetch === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    setError(null);
    
    try {
      const skip = pageToFetch * LIMIT;
      const response = await fetch(`${BASE_URL}/confessions?skip=${skip}&limit=${LIMIT}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
      });
      const result = await response.json();

      if(response.status === 401){
        logout();
        return;
      }
      
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
        setError({
          message: result.message || "Failed to load confessions",
          statusCode: response.status
        });
      }
    } catch (error) {
      setError({
        message: "Network error. Please check your connection and try again.",
        statusCode: 0
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    // Scroll to top instantly when a refresh is triggered
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
    fetchConfessions(0, true);
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !error) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchConfessions(nextPage);
    }
  }, [loadingMore, hasMore, page, error]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#E94560" />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  };

  const renderErrorState = () => {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={50} color="#E94560" />
        <Text style={styles.errorTitle}>Failed to load confessions</Text>
        <Text style={styles.errorMessage}>{"Something went wrong"}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchConfessions(0, true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
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
              hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
            >
              <Icon name="message-circle" size={18} color="#E94560" />
              {item.comments_count > 0 && (
                <Text style={styles.commentCount}>{item.comments_count}</Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.timeText}>{formatTimeAgo(item.created_at)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with logo and title latest */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Confessions</Text>
      </View>
      
      {loading && page === 0 ? (
         <View style={styles.loaderContainer}>
         <ActivityIndicator size="large" color="#E94560" />
       </View>
       ) : error && confessions.length === 0 ? (
        renderErrorState()
      ) : (
        <FlatList
          ref={flatListRef}
          data={confessions}
          // keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          keyExtractor={(item, index) => {
            if (item && item.id !== null && item.id !== undefined) {
              return `confession-${item.id}`;
            }
            return `confession-index-${index}-${item.created_at || Date.now()}`;
          }}

          // if two children later-----
          // keyExtractor={(item, index) => {
          //   if (item && item.id !== null && item.id !== undefined) {
          //     return `confession-${item.id}`;
          //   }
          //   return `confession-index-${index}-${item.created_at || Date.now()}`;
          // }}
          // -------------
          
          renderItem={renderConfession}
          contentContainerStyle={[styles.listContent, {paddingBottom: loadingMore || !hasMore ? 100 : 0}, confessions.length ===0 && { flex: 1, justifyContent: 'center'} ]}
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
        confession_id={selectedConfessionId} 
        onCommentPosted={handleCommentPosted}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 3,
    borderRadius: 25,
  },
  title: {
    fontSize: 24,
    color: "#E94560",
    fontWeight: "bold",
    marginVertical: 16,
    marginTop: 8,
    marginBottom: 5,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  errorMessage: {
    color: "#CCCCCC",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#E94560",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#CCCCCC",
    fontSize: 16,
  },
});

export default HomeScreen;