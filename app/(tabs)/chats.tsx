import GradientScreen from '@/components/ui/GradientScreen';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const pastelColors = ['#E57373', '#64B5F6', '#81C784', '#FFD54F', '#BA68C8'];

const chats = [
  {
    id: 1,
    user: 'Alice',
    lastMessage: {
      type: 'text',
      content: 'Hey, how are you?',
      time: '10:30 AM',
    },
    isPinned: true,
    isUnread: true,
  },
  {
    id: 2,
    user: 'Bob',
    lastMessage: {
      type: 'image',
      content: 'https://via.placeholder.com/150',
      time: '9:15 AM',
    },
    isPinned: false,
    isUnread: false,
  },
  {
    id: 3,
    user: 'Charlie',
    lastMessage: {
      type: 'text',
      content: 'Let’s catch up later!',
      time: 'Yesterday',
    },
    isPinned: false,
    isUnread: true,
  },
  {
    id: 4,
    user: 'Diana',
    lastMessage: {
      type: 'text',
      content: 'Sure, sounds good!',
      time: '2 days ago',
    },
    isPinned: false,
    isUnread: false,
  },
  {
    id: 5,
    user: 'Eve',
    lastMessage: {
      type: 'text',
      content: 'See you soon!',
      time: '3 days ago',
    },
    isPinned: false,
    isUnread: false,
  },
];

const ChatCard = ({
  user,
  lastMessage,
  id,
  isPinned,
  isUnread,
  onLongPress,
  isSelected,
}: any) => {
  const avatarColor = pastelColors[(id - 1) % pastelColors.length];
  const avatarLetter = user.charAt(0).toUpperCase();

  const text = useThemeColor({}, 'text');
  const secondary = useThemeColor({}, 'secondary');
  const primary = useThemeColor({}, 'primary');

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
              borderColor: isSelected ? primary : 'transparent',
            },
          ]}
        >
          <Text style={styles.avatarText}>{avatarLetter}</Text>
          {isSelected && (
            <View style={styles.checkmark}>
              <MaterialIcons name='check-circle' size={18} color={primary} />
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
        <Text
          style={[
            styles.lastMessage,
            {
              color: secondary,
              fontWeight: isUnread ? '600' : '400',
            },
          ]}
          numberOfLines={1}
        >
          {lastMessage.type === 'text' ? (
            lastMessage.content
          ) : (
            <>
              <MaterialIcons name='image' size={14} color={secondary} /> Image
            </>
          )}
        </Text>
      </View>
      {isPinned && (
        <MaterialIcons
          name='push-pin'
          size={18}
          color={secondary}
          style={{ marginLeft: 8 }}
        />
      )}
    </TouchableOpacity>
  );
};

const Chats = () => {
  const [selectedChats, setSelectedChats] = useState<number[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);

  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  const primary = useThemeColor({}, 'primary');

  const handleLongPress = (id: number) => {
    setSelectedChats((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAction = (action: 'pin' | 'delete') => {
    // TODO: Handle pin or delete
    setSelectedChats([]);
  };

  const filteredChats = filterUnread
    ? chats.filter((chat) => chat.isUnread)
    : chats;

  return (
    <GradientScreen>
      <View style={[styles.container, { backgroundColor: background }]}>
        {selectedChats.length > 0 ? (
          <View style={styles.selectionBar}>
            <TouchableOpacity onPress={() => setSelectedChats([])}>
              <MaterialIcons name='arrow-back' size={16} color={text} />
            </TouchableOpacity>
            <View style={styles.actionIcons}>
              <TouchableOpacity onPress={() => handleAction('pin')}>
                <MaterialIcons name='push-pin' size={16} color={text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAction('delete')}>
                <MaterialIcons name='delete' size={16} color={text} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.topBar}>
            <Text style={[styles.title, { color: text }]}>Messages</Text>
            <TouchableOpacity onPress={() => setFilterUnread(!filterUnread)}>
              <Text style={[styles.filterText, { color: primary }]}>
                {filterUnread ? 'Show All' : 'Unread'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ChatCard
              {...item}
              isSelected={selectedChats.includes(item.id)}
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
    marginHorizontal: 16,
    marginTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
  },
  chatList: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderRadius: 10,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  chatInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 17,
    fontWeight: '500',
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    marginLeft: 8,
  },
});

export default Chats;
