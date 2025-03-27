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
import { useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import { confessionsData } from "../constants/confessionsData";
import { renderContentWithMentions } from "../helpers/renderContentWithMentions";
import CommentSection from "../components/CommentSection";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [selectedConfession, setSelectedConfession] = useState(null);
  const [expandedConfessions, setExpandedConfessions] = useState({});

  const handleOpenComments = (confession) => {
    setSelectedConfession(confession);
    setCommentsVisible(true);
  };

  const handlePostComment = (text) => {
    console.log("New Comment:", text);
  };

  const toggleExpand = (id) => {
    setExpandedConfessions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderConfession = ({ item }) => {
    const isExpanded = expandedConfessions[item.id];
    const confessionText = item.text;
  
    return (
      <View style={styles.card}>
        {item.comments > 10 && (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>Trending ❤‍🔥</Text>
          </View>
        )}
        <Text style={styles.confessionText}>

        {/* agar hua toh read more else we will show nothing */}
        {renderContentWithMentions(
            isExpanded ? confessionText : `${confessionText.slice(0, 250)}${confessionText.length > 250 ? "..." : ""}`,
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
  
            {confessionText.length > 250 && (
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <Text style={styles.readMoreText}>
                  {isExpanded ? "Read less" : "Read more..."}
                </Text>
              </TouchableOpacity>
            )}
          </View>
  
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title at the top */}
      <Text style={styles.title}>Confessions</Text>

      <FlatList
        data={confessionsData}
        keyExtractor={(item) => item.id}
        renderItem={renderConfession}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  readMoreText: {
    color: "#E94560",
    fontSize: 14,
    marginTop: 2,
    fontWeight: "bold",
    marginLeft: 8
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
});

export default HomeScreen;