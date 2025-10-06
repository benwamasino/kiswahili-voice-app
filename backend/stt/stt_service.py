import os
import base64
import logging
import json
from typing import Optional

logger = logging.getLogger(__name__)

class STTService:
    """
    Speech-to-Text service using Vosk Swahili model
    Model: Vosk Swahili
    Source: https://alphacephei.com/vosk/models
    """
    
    def __init__(self):
        self.model = None
        self.initialized = False
        self.model_path = None
        
    def initialize(self, model_path: Optional[str] = None):
        """
        Initialize the STT model
        
        Args:
            model_path: Path to Vosk model directory
        """
        try:
            from vosk import Model, KaldiRecognizer
            
            if model_path is None:
                # Default model path
                model_path = os.path.join(
                    os.path.dirname(__file__),
                    'models',
                    'vosk-model-small-sw-0.1'
                )
            
            if not os.path.exists(model_path):
                logger.warning(f"Vosk model not found at {model_path}")
                logger.info("Please download the Swahili model from:")
                logger.info("https://alphacephei.com/vosk/models/vosk-model-small-sw-0.1.zip")
                self.initialized = False
                return
            
            logger.info(f"Loading Vosk model from: {model_path}")
            self.model = Model(model_path)
            self.initialized = True
            logger.info("STT model initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize STT model: {e}")
            logger.warning("STT will run in mock mode")
            self.initialized = False
    
    def recognize(self, audio_base64: str) -> str:
        """
        Recognize speech from audio data
        
        Args:
            audio_base64: Base64 encoded audio data
            
        Returns:
            Recognized text
        """
        if not self.initialized:
            logger.warning("STT model not initialized, attempting to initialize...")
            self.initialize()
        
        if not self.initialized:
            # Return mock text for testing
            return self._generate_mock_text()
        
        try:
            from vosk import KaldiRecognizer
            import wave
            import io
            
            # Decode base64 audio
            audio_data = base64.b64decode(audio_base64)
            
            # Create recognizer
            recognizer = KaldiRecognizer(self.model, 16000)
            
            # Process audio data
            # Note: In production, this would handle proper audio format conversion
            audio_stream = io.BytesIO(audio_data)
            
            # Process audio chunks
            recognizer.AcceptWaveform(audio_data)
            result = json.loads(recognizer.FinalResult())
            
            text = result.get('text', '')
            return text if text else "Could not recognize speech"
            
        except Exception as e:
            logger.error(f"STT recognition error: {e}")
            return self._generate_mock_text()
    
    def _generate_mock_text(self) -> str:
        """Generate mock text for testing"""
        return "Habari yako"
