import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  onSpeak: (text: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({messages, onSpeak}) => {
  return (
    <View>
      {messages.map((message) => (
        <TouchableOpacity
          key={message.id}
          style={styles.messageCard}
          onPress={() => onSpeak(message.text)}>
          <View style={styles.messageHeader}>
            <Text style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString()}
            </Text>
            <Text style={styles.speakIcon}>🔊</Text>
          </View>
          <Text style={styles.messageText}>{message.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  messageCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  speakIcon: {
    fontSize: 16,
  },
  messageText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
  },
});

export default MessageList;
