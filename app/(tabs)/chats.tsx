import GradientScreen from "@/components/ui/GradientScreen";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const pastelColors = ["#EF9A9A", "#90CAF9", "#A5D6A7", "#CE93D8"];

const chats = [
  {
    id: 1,
    user: "Alice Sawyer",
    lastMessage: {
      type: "text",
      content: "Hey, how are you?",
      time: "10:30 AM",
    },
    isPinned: true,
    isUnread: true,
  },
  {
    id: 2,
    user: "Bob",
    lastMessage: {
      type: "image",
      content: "https://via.placeholder.com/150",
      time: "9:15 AM",
    },
    isPinned: false,
    isUnread: false,
  },
  {
    id: 3,
    user: "Charlie",
    lastMessage: {
      type: "text",
      content: "Let’s catch up later!",
      time: "Yesterday",
    },
    isPinned: false,
    isUnread: true,
  },
  {
    id: 4,
    user: "Diana",
    lastMessage: {
      type: "text",
      content: "Sure, sounds good!",
      time: "2 days ago",
    },
    isPinned: false,
    isUnread: false,
  },
  {
    id: 5,
    user: "Eve",
    lastMessage: {
      type: "text",
      content: "See you soon!",
      time: "3 days ago",
    },
    isPinned: false,
    isUnread: false,
  },
];

const ChatCard = ({
  user,
  lastMessage,
  id,
  onLongPress,
  isSelected,
  isPinned,
  isUnread,
}: any) => {
  const avatarColor = pastelColors[(id - 1) % pastelColors.length];
  const avatarLetter = user
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word: string) => word[0].toUpperCase())
    .join("");

  const text = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");
  const primary = useThemeColor({}, "primary");
  const theme = useThemeColor({}, "theme");

  return (
    <TouchableOpacity
      style={[
        styles.chatCard,
        isSelected && { backgroundColor: `${primary}15` },
      ]}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: avatarColor,
              borderColor: isSelected ? primary : "transparent",
            },
          ]}
        >
          <Text style={styles.avatarText}>{avatarLetter}</Text>
          {isSelected && (
            <View style={styles.checkmark}>
              <MaterialIcons name="check-circle" size={18} color={primary} />
            </View>
          )}
        </View>
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.nameRow}>
          <Text style={[styles.userName, { color: text }]}>{user}</Text>
          <Text style={[styles.time, { color: secondary }]}>
            {lastMessage.time}
          </Text>
        </View>

        <View style={styles.nameRow}>
          {lastMessage.type === "text" ? (
            <Text
              style={[
                styles.lastMessage,
                {
                  color: secondary,
                },
              ]}
              numberOfLines={1}
            >
              {lastMessage.content}
            </Text>
          ) : (
            <View style={styles.imageMessageContainer}>
              <MaterialIcons
                name="image"
                size={15}
                color={secondary}
                style={{ paddingTop: 2 }}
              />

              <Text
                style={[
                  styles.lastMessage,
                  {
                    color: secondary,
                  },
                ]}
              >
                Image
              </Text>
            </View>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {isPinned && (
              <MaterialIcons name="push-pin" size={18} color={secondary} />
            )}
            {isUnread && (
              <View style={[styles.unreadBadge, { backgroundColor: primary }]}>
                <Text
                  style={[
                    styles.unreadText,
                    { color: theme === "dark" ? "black" : "white" },
                  ]}
                >
                  1
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "favorites"
  >("all");

  const [searchQuery, setSearchQuery] = useState("");

  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");
  const primary = useThemeColor({}, "primary");

  const handleLongPress = (id: number) => {
    if (selectedChat) {
      setSelectedChat(null);
    } else {
      setSelectedChat(id);
    }
  };

  const handleAction = (action: "pin" | "delete" | "archive") => {
    // TODO: Handle pin or delete
    setSelectedChat(null);
  };

  const filteredChats = chats.filter((chat) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "unread" && chat.isUnread) ||
      (activeFilter === "favorites" && chat.isPinned);

    const matchesSearch = chat.user
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <GradientScreen>
      <View style={[styles.container]}>
        {selectedChat ? (
          <View style={styles.selectionBar}>
            <TouchableOpacity onPress={() => setSelectedChat(null)}>
              <MaterialIcons name="arrow-back" size={20} color={text} />
            </TouchableOpacity>
            <View style={styles.actionIcons}>
              <TouchableOpacity onPress={() => handleAction("pin")}>
                <MaterialCommunityIcons
                  name={
                    chats.find((chat) => chat.id === selectedChat)?.isPinned
                      ? "pin-off-outline"
                      : "pin-outline"
                  }
                  size={20}
                  color={text}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAction("delete")}>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={20}
                  color={text}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAction("archive")}>
                <MaterialCommunityIcons
                  name="archive-outline"
                  size={20}
                  color={text}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.topBar}>
            <Text style={[styles.title, { color: primary }]}>Messages</Text>
          </View>
        )}

        <View style={[styles.searchWrapper, { borderColor: border }]}>
          <View style={styles.searchBox}>
            <TextInput
              style={[styles.input, { color: text }]}
              placeholder="Search "
              placeholderTextColor={secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <MaterialIcons name="search" size={20} color={primary} />
          </View>
        </View>

        <View style={styles.filtersRow}>
          {["all", "unread", "favorites"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter as any)}
              style={[
                styles.filterTab,
                {
                  borderColor: activeFilter === filter ? primary : border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  {
                    color: activeFilter === filter ? primary : secondary,
                    fontWeight: activeFilter === filter ? "600" : "400",
                  },
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ChatCard
              {...item}
              isSelected={selectedChat === item.id}
              onLongPress={() => handleLongPress(item.id)}
            />
          )}
          contentContainerStyle={styles.chatList}
        />
      </View>
    </GradientScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 8,
    marginHorizontal: 24,
    height: 50,
  },
  selectionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 24,
    height: 50,
  },
  actionIcons: {
    flexDirection: "row",
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  filterText: {
    fontSize: 15,
    fontWeight: "600",
  },
  chatList: {
    paddingVertical: 4,
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 6,
    borderRadius: 10,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginRight: 12,
    position: "relative",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  checkmark: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "white",
    borderRadius: 10,
  },
  chatInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 17,
    fontWeight: "500",
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    marginLeft: 8,
  },
  imageMessageContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  filtersRow: {
    flexDirection: "row",
    gap: 15,
    marginVertical: 10,
    marginHorizontal: 24,
  },
  filterTab: {
    paddingVertical: 3,
    paddingHorizontal: 16,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  searchWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    overflow: "hidden",
    marginVertical: 12,
    marginHorizontal: 24,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export default Chats;
