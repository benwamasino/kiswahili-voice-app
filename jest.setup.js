// Jest setup file
import 'react-native-gesture-handler/jestSetup';

// Mock native modules
jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn(),
}));

jest.mock('react-native-tts', () => ({
  speak: jest.fn(),
  setDefaultLanguage: jest.fn(),
  voices: jest.fn(() => Promise.resolve([])),
}));

jest.mock('@react-native-voice/voice', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  destroy: jest.fn(),
  removeAllListeners: jest.fn(),
}));
