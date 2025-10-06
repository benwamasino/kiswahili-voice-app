import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

export class STTService {
  static async recognizeSpeech(): Promise<string> {
    try {
      // Call local backend with Vosk model
      const response = await axios.post(
        `${BACKEND_URL}/recognize`,
        {},
        {timeout: 10000}
      );
      
      if (response.data && response.data.text) {
        return response.data.text;
      }
      
      throw new Error('No text recognized');
    } catch (error) {
      console.error('STT error:', error);
      // In a real implementation, would use react-native-voice as fallback
      throw error;
    }
  }

  static async startListening(): Promise<void> {
    // Implementation for continuous listening
    console.log('Starting continuous listening...');
  }

  static async stopListening(): Promise<void> {
    // Implementation to stop listening
    console.log('Stopping listening...');
  }
}
