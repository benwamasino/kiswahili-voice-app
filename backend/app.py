from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Import backend services
from tts.tts_service import TTSService
from stt.stt_service import STTService
from nlp.nlp_service import NLPService

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
tts_service = TTSService()
stt_service = STTService()
nlp_service = NLPService()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

@app.route('/synthesize', methods=['POST'])
def synthesize():
    """
    Text-to-Speech endpoint
    Expects: {"text": "Habari yako"}
    Returns: {"audio": "base64_encoded_audio"}
    """
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        audio_base64 = tts_service.synthesize(text)
        return jsonify({'audio': audio_base64}), 200
        
    except Exception as e:
        logger.error(f'TTS error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/recognize', methods=['POST'])
def recognize():
    """
    Speech-to-Text endpoint
    Expects: {"audio": "base64_encoded_audio"} or streams audio
    Returns: {"text": "recognized text"}
    """
    try:
        data = request.json
        audio_data = data.get('audio', '')
        
        if not audio_data:
            return jsonify({'error': 'No audio data provided'}), 400
        
        text = stt_service.recognize(audio_data)
        return jsonify({'text': text}), 200
        
    except Exception as e:
        logger.error(f'STT error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/correct', methods=['POST'])
def correct():
    """
    Grammar correction endpoint
    Expects: {"text": "raw text"}
    Returns: {"corrected_text": "corrected text", "suggestions": [...]}
    """
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        corrected_text, suggestions = nlp_service.correct(text)
        return jsonify({
            'corrected_text': corrected_text,
            'suggestions': suggestions
        }), 200
        
    except Exception as e:
        logger.error(f'NLP error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/autocomplete', methods=['POST'])
def autocomplete():
    """
    Autocomplete endpoint
    Expects: {"text": "partial text"}
    Returns: {"suggestions": ["suggestion1", "suggestion2", ...]}
    """
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        suggestions = nlp_service.autocomplete(text)
        return jsonify({'suggestions': suggestions}), 200
        
    except Exception as e:
        logger.error(f'Autocomplete error: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
