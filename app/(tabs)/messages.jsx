import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useApp } from '../../hooks/use-app-context';
import { MessageCircle } from 'lucide-react-native';

const mockChats = [
  {
    id: '1',
    userName: 'Marco Bianchi',
    lastMessage: 'La stanza è ancora disponibile?',
    timestamp: '10:30',
    unread: true,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    userName: 'Laura Verdi',
    lastMessage: 'Perfetto, ci vediamo domani',
    timestamp: 'Ieri',
    unread: false,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
];

export default function MessagesScreen() {
  const { t, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.dashboard.messages}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MessageCircle size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>Accedi per vedere i messaggi</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderChat = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.userName, item.unread && styles.unreadText]}>
            {item.userName}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text 
          style={[styles.lastMessage, item.unread && styles.unreadText]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.dashboard.messages}</Text>
      </View>
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  unreadText: {
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 78,
  },
});