import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

interface SpeechButtonProps {
  onPress: () => void;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🎤</Text>
      </View>
      <Text style={styles.buttonText}>Ongea / Speak</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    fontSize: 32,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SpeechButton;
