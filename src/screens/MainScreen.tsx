import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SpeechButton from '../components/SpeechButton';
import TypeButton from '../components/TypeButton';
import MessageList from '../components/MessageList';
import {TTSService} from '../services/TTSService';
import {STTService} from '../services/STTService';
import {DatabaseService} from '../services/DatabaseService';

const MainScreen = () => {
  const [messages, setMessages] = useState<Array<{id: number; text: string; timestamp: Date}>>([]);
  const [currentText, setCurrentText] = useState('');

  const handleSpeech = async () => {
    try {
      const text = await STTService.recognizeSpeech();
      if (text) {
        const newMessage = {
          id: Date.now(),
          text,
          timestamp: new Date(),
        };
        setMessages([...messages, newMessage]);
        await DatabaseService.saveMessage(newMessage);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
    }
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      await TTSService.speak(text);
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Kiswahili Voice App</Text>
        <Text style={styles.subtitle}>Programu ya Sauti ya Kiswahili</Text>
      </View>

      <ScrollView style={styles.messageContainer}>
        <MessageList messages={messages} onSpeak={handleTextToSpeech} />
      </ScrollView>

      <View style={styles.controls}>
        <SpeechButton onPress={handleSpeech} />
        <TypeButton
          value={currentText}
          onChange={setCurrentText}
          onSubmit={(text) => {
            const newMessage = {
              id: Date.now(),
              text,
              timestamp: new Date(),
            };
            setMessages([...messages, newMessage]);
            DatabaseService.saveMessage(newMessage);
            setCurrentText('');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
  },
  messageContainer: {
    flex: 1,
    padding: 10,
  },
  controls: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default MainScreen;
