import os
import base64
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class TTSService:
    """
    Text-to-Speech service using the Swahili MMS TTS model
    Model: Benjamin-png/swahili-mms-tts-finetuned
    Source: https://huggingface.co/Benjamin-png/swahili-mms-tts-finetuned
    """
    
    def __init__(self):
        self.model = None
        self.processor = None
        self.initialized = False
        
    def initialize(self):
        """
        Initialize the TTS model
        Downloads and loads the Swahili MMS TTS model from Hugging Face
        """
        try:
            from transformers import VitsModel, AutoTokenizer
            import torch
            
            model_name = "Benjamin-png/swahili-mms-tts-finetuned"
            logger.info(f"Loading TTS model: {model_name}")
            
            # Load tokenizer and model
            self.processor = AutoTokenizer.from_pretrained(model_name)
            self.model = VitsModel.from_pretrained(model_name)
            
            # Set to evaluation mode
            self.model.eval()
            
            self.initialized = True
            logger.info("TTS model initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize TTS model: {e}")
            logger.warning("TTS will run in mock mode")
            self.initialized = False
    
    def synthesize(self, text: str) -> str:
        """
        Convert text to speech
        
        Args:
            text: Input text in Swahili
            
        Returns:
            Base64 encoded audio data
        """
        if not self.initialized:
            logger.warning("TTS model not initialized, attempting to initialize...")
            self.initialize()
        
        if not self.initialized:
            # Return mock audio data for testing
            return self._generate_mock_audio()
        
        try:
            import torch
            import scipy.io.wavfile as wavfile
            import io
            
            # Tokenize input text
            inputs = self.processor(text, return_tensors="pt")
            
            # Generate audio
            with torch.no_grad():
                output = self.model(**inputs).waveform
            
            # Convert to numpy array
            audio_data = output.squeeze().cpu().numpy()
            
            # Convert to WAV format in memory
            buffer = io.BytesIO()
            sample_rate = 16000  # Default sample rate for MMS models
            wavfile.write(buffer, sample_rate, audio_data)
            
            # Encode as base64
            audio_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            return audio_base64
            
        except Exception as e:
            logger.error(f"TTS synthesis error: {e}")
            return self._generate_mock_audio()
    
    def _generate_mock_audio(self) -> str:
        """Generate mock audio data for testing"""
        # Return empty base64 string as placeholder
        return base64.b64encode(b"MOCK_AUDIO_DATA").decode('utf-8')
