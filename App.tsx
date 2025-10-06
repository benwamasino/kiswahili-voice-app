import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import MainScreen from './src/screens/MainScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <MainScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
