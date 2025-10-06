import axios from 'axios';
import Tts from 'react-native-tts';

const BACKEND_URL = 'http://localhost:5000';

export class TTSService {
  static async speak(text: string): Promise<void> {
    try {
      // Try to use local backend first
      const response = await axios.post(
        `${BACKEND_URL}/synthesize`,
        {text},
        {timeout: 5000}
      );
      
      if (response.data && response.data.audio) {
        // Play the audio from backend
        // Audio is base64 encoded, would need to be decoded and played
        console.log('Using backend TTS');
      }
    } catch (error) {
      // Fallback to device TTS
      console.log('Using device TTS fallback');
      await Tts.setDefaultLanguage('sw-KE'); // Swahili (Kenya)
      await Tts.speak(text);
    }
  }

  static async setLanguage(language: string): Promise<void> {
    await Tts.setDefaultLanguage(language);
  }

  static async getAvailableVoices(): Promise<any[]> {
    return await Tts.voices();
  }
}
