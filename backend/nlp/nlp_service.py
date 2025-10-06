import logging
from typing import List, Tuple

logger = logging.getLogger(__name__)

class NLPService:
    """
    NLP service for grammar correction and autocomplete in Swahili
    Uses lightweight transformer models optimized for mobile deployment
    """
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.initialized = False
        
        # Common Swahili words for autocomplete
        self.common_words = [
            "habari", "jambo", "nzuri", "sana", "asante",
            "karibu", "tafadhali", "samahani", "kwaheri",
            "ndiyo", "hapana", "leo", "kesho", "jana",
            "asubuhi", "mchana", "jioni", "usiku",
            "chakula", "maji", "nyumba", "shule", "kazi"
        ]
        
    def initialize(self):
        """
        Initialize the NLP model
        Uses a lightweight model suitable for mobile deployment
        """
        try:
            # In production, would use a proper Swahili language model
            # For now, using basic rule-based approach
            logger.info("Initializing NLP service with rule-based approach")
            self.initialized = True
            
        except Exception as e:
            logger.error(f"Failed to initialize NLP model: {e}")
            self.initialized = False
    
    def correct(self, text: str) -> Tuple[str, List[str]]:
        """
        Correct grammar and spelling in Swahili text
        
        Args:
            text: Input text to correct
            
        Returns:
            Tuple of (corrected_text, suggestions)
        """
        if not self.initialized:
            self.initialize()
        
        # Basic corrections
        corrected = text.strip()
        suggestions = []
        
        # Capitalize first letter
        if corrected and corrected[0].islower():
            corrected = corrected[0].upper() + corrected[1:]
            suggestions.append("Capitalized first letter")
        
        # Add period at end if missing
        if corrected and corrected[-1] not in '.!?':
            corrected += '.'
            suggestions.append("Added period")
        
        return corrected, suggestions
    
    def autocomplete(self, text: str, max_suggestions: int = 5) -> List[str]:
        """
        Provide autocomplete suggestions for Swahili text
        
        Args:
            text: Partial text to complete
            max_suggestions: Maximum number of suggestions
            
        Returns:
            List of suggested completions
        """
        if not self.initialized:
            self.initialize()
        
        if not text:
            return []
        
        # Simple prefix matching for now
        text_lower = text.lower()
        suggestions = [
            word for word in self.common_words
            if word.startswith(text_lower)
        ]
        
        return suggestions[:max_suggestions]
    
    def get_word_suggestions(self, word: str) -> List[str]:
        """
        Get suggestions for a specific word
        
        Args:
            word: Word to get suggestions for
            
        Returns:
            List of similar words
        """
        # In production, would use edit distance or embedding similarity
        return self.autocomplete(word)
