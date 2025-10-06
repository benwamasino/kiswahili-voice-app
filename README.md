# Kiswahili Voice App

An AI-powered offline communication app in Kiswahili for speech-impaired users. This app provides speech-to-text, grammar correction, and text-to-speech capabilities optimized for low-end smartphones.

## Features

- 🎤 **Speech-to-Text (STT)**: Real-time Swahili speech recognition using Vosk
- 🔊 **Text-to-Speech (TTS)**: Natural Swahili voice synthesis using Hugging Face MMS-TTS
- ✍️ **Grammar Correction**: NLP-powered text correction and autocomplete
- 💾 **Local Storage**: SQLite database for offline message persistence
- 📱 **Accessible UI**: Large icons, adjustable fonts, and voice feedback
- 🌍 **Fully Offline**: All processing happens locally on the device

## Architecture

### Frontend (React Native)
- `App.tsx` - Main application entry point
- `src/screens/MainScreen.tsx` - Primary user interface
- `src/components/` - Reusable UI components
- `src/services/` - Service layer for TTS, STT, and database

### Backend (Python/Flask)
- `backend/app.py` - Flask API server
- `backend/tts/` - Text-to-Speech service
- `backend/stt/` - Speech-to-Text service
- `backend/nlp/` - Grammar correction and autocomplete

## Prerequisites

### For React Native Frontend
- Node.js >= 18.x
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### For Python Backend
- Python >= 3.8
- pip package manager

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/benwamasino/kiswahili-voice-app.git
cd kiswahili-voice-app
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Download Models

#### Vosk Swahili Model (for STT)
```bash
cd backend/stt
mkdir -p models
cd models
wget https://alphacephei.com/vosk/models/vosk-model-small-sw-0.1.zip
unzip vosk-model-small-sw-0.1.zip
```

#### Swahili MMS-TTS Model (for TTS)
The TTS model will be automatically downloaded from Hugging Face on first use. Ensure you have internet connection during initial setup.

## Running the Application

### Start the Backend Server
```bash
cd backend
python app.py
```
The server will start on `http://localhost:5000`

### Start the React Native App

#### For Android
```bash
npm run android
```

#### For iOS
```bash
npm run ios
```

## Model Optimization

### Converting to ONNX
For better mobile performance, you can convert the TTS model to ONNX format:

```bash
python -m transformers.onnx --model=Benjamin-png/swahili-mms-tts-finetuned onnx/
```

### Model Quantization
Reduce model size using ONNX quantization tools:

```bash
python -c "
from onnxruntime.quantization import quantize_dynamic
quantize_dynamic('model.onnx', 'model_quantized.onnx')
"
```

## API Endpoints

### Health Check
```
GET /health
Response: {"status": "healthy"}
```

### Text-to-Speech
```
POST /synthesize
Body: {"text": "Habari yako"}
Response: {"audio": "base64_encoded_audio"}
```

### Speech-to-Text
```
POST /recognize
Body: {"audio": "base64_encoded_audio"}
Response: {"text": "recognized text"}
```

### Grammar Correction
```
POST /correct
Body: {"text": "raw text"}
Response: {"corrected_text": "...", "suggestions": [...]}
```

### Autocomplete
```
POST /autocomplete
Body: {"text": "partial"}
Response: {"suggestions": ["suggestion1", "suggestion2"]}
```

## Project Structure

```
kiswahili-voice-app/
├── App.tsx                 # Main app component
├── index.js                # App entry point
├── package.json            # Node dependencies
├── app.json               # React Native config
├── src/
│   ├── components/        # UI components
│   │   ├── SpeechButton.tsx
│   │   ├── TypeButton.tsx
│   │   └── MessageList.tsx
│   ├── screens/          # App screens
│   │   └── MainScreen.tsx
│   └── services/         # Business logic
│       ├── TTSService.ts
│       ├── STTService.ts
│       └── DatabaseService.ts
├── backend/
│   ├── app.py            # Flask server
│   ├── requirements.txt  # Python dependencies
│   ├── tts/             # TTS service
│   │   └── tts_service.py
│   ├── stt/             # STT service
│   │   └── stt_service.py
│   └── nlp/             # NLP service
│       └── nlp_service.py
└── README.md            # This file
```

## Usage

1. **Speaking**: Tap the "Ongea / Speak" button to start voice recording
2. **Typing**: Use the text input to type messages in Kiswahili
3. **Listening**: Tap any message to hear it spoken aloud
4. **Messages**: All messages are automatically saved locally

## Performance Targets

- App runs fully offline on Android
- End-to-end latency < 1.5 seconds
- All communication in Kiswahili
- Optimized for low-end smartphones

## Models Used

### Swahili MMS-TTS
- **Source**: [Benjamin-png/swahili-mms-tts-finetuned](https://huggingface.co/Benjamin-png/swahili-mms-tts-finetuned)
- **Framework**: Transformers (PyTorch)
- **Purpose**: Text-to-Speech synthesis

### Vosk Swahili
- **Source**: [Vosk Models](https://alphacephei.com/vosk/models)
- **Framework**: Vosk
- **Purpose**: Speech-to-Text recognition

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Backend not connecting
Ensure the Flask server is running on port 5000:
```bash
curl http://localhost:5000/health
```

### Models not loading
Check that models are downloaded to the correct directories:
- TTS: Automatically downloaded via Hugging Face
- STT: `backend/stt/models/vosk-model-small-sw-0.1/`

### Audio not playing
Verify device permissions for microphone and audio:
- Android: Check `AndroidManifest.xml` for permissions
- iOS: Check `Info.plist` for permissions

## License

MIT License - See [LICENSE](LICENSE) file for details

## Contributors

- Benson Wama

## Acknowledgments

- Hugging Face for the Swahili TTS model
- Vosk team for the Swahili STT model
- React Native community

## Support

For issues and questions, please open an issue on GitHub.
