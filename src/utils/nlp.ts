import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

export class NLPUtils {
  /**
   * Correct grammar and spelling in Swahili text
   */
  static async correctText(text: string): Promise<{correctedText: string; suggestions: string[]}> {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/correct`,
        {text},
        {timeout: 5000}
      );
      
      return {
        correctedText: response.data.corrected_text,
        suggestions: response.data.suggestions,
      };
    } catch (error) {
      console.error('Grammar correction error:', error);
      // Fallback to basic corrections
      return {
        correctedText: text.trim(),
        suggestions: [],
      };
    }
  }

  /**
   * Get autocomplete suggestions for partial text
   */
  static async getAutocompleteSuggestions(text: string): Promise<string[]> {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/autocomplete`,
        {text},
        {timeout: 3000}
      );
      
      return response.data.suggestions || [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  }

  /**
   * Basic local text corrections (fallback)
   */
  static basicCorrections(text: string): string {
    let corrected = text.trim();
    
    // Capitalize first letter
    if (corrected && corrected[0]) {
      corrected = corrected[0].toUpperCase() + corrected.slice(1);
    }
    
    // Add period if missing
    if (corrected && !corrected.match(/[.!?]$/)) {
      corrected += '.';
    }
    
    return corrected;
  }

  /**
   * Common Swahili greetings and phrases
   */
  static commonPhrases = [
    'Habari yako',
    'Jambo',
    'Asante sana',
    'Karibu',
    'Tafadhali',
    'Samahani',
    'Kwaheri',
    'Ndiyo',
    'Hapana',
    'Habari za asubuhi',
    'Habari za mchana',
    'Habari za jioni',
  ];

  /**
   * Get phrase suggestions based on partial input
   */
  static getPhraseMatches(partial: string): string[] {
    if (!partial) return [];
    
    const lowerPartial = partial.toLowerCase();
    return this.commonPhrases.filter(phrase =>
      phrase.toLowerCase().includes(lowerPartial)
    );
  }
}
