import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface TypeButtonProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: (text: string) => void;
}

const TypeButton: React.FC<TypeButtonProps> = ({value, onChange, onSubmit}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Andika ujumbe / Type message"
        placeholderTextColor="#999"
        multiline
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => {
          if (value.trim()) {
            onSubmit(value);
          }
        }}>
        <Text style={styles.sendButtonText}>Tuma / Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TypeButton;
