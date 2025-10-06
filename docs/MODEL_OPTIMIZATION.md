# Model Optimization Guide

This guide explains how to optimize the AI models for mobile deployment in the Kiswahili Voice App.

## Overview

The app uses two main models that need optimization for mobile devices:
1. **Swahili MMS-TTS Model** (Text-to-Speech)
2. **Vosk Swahili Model** (Speech-to-Text)

## Goals

- Reduce model size to < 100MB each
- Minimize inference latency to < 1.5s end-to-end
- Enable offline operation on low-end devices
- Maintain acceptable accuracy

## TTS Model Optimization

### 1. Converting to ONNX

ONNX Runtime provides better performance on mobile devices.

```bash
pip install transformers onnx onnxruntime

python -m transformers.onnx \
  --model=Benjamin-png/swahili-mms-tts-finetuned \
  --feature=automatic-speech-recognition \
  onnx/swahili-tts/
```

### 2. Quantization

Reduce model size and improve inference speed:

```python
from onnxruntime.quantization import quantize_dynamic

quantize_dynamic(
    model_input='onnx/swahili-tts/model.onnx',
    model_output='onnx/swahili-tts/model_quantized.onnx',
    weight_type=QuantType.QInt8
)
```

### 3. Testing Optimized Model

```python
import onnxruntime as ort
import numpy as np

session = ort.InferenceSession('model_quantized.onnx')
inputs = {'input_ids': np.array([[1, 2, 3, 4]])}
outputs = session.run(None, inputs)
```

## STT Model Optimization

### 1. Use Lightweight Vosk Model

Download the small Swahili model instead of the large one:

```bash
# Small model (~40MB)
wget https://alphacephei.com/vosk/models/vosk-model-small-sw-0.1.zip

# Instead of large model (~900MB)
# wget https://alphacephei.com/vosk/models/vosk-model-sw-0.6.zip
```

### 2. Model Configuration

Configure Vosk for optimal mobile performance:

```python
from vosk import Model, KaldiRecognizer

model = Model("vosk-model-small-sw-0.1")
recognizer = KaldiRecognizer(model, 16000)

# Enable faster decoding
recognizer.SetMaxAlternatives(1)
recognizer.SetWords(False)
```

## NLP Model Optimization

### 1. Using DistilBERT

For grammar correction and autocomplete, use a distilled model:

```bash
pip install transformers

python
>>> from transformers import DistilBertTokenizer, DistilBertModel
>>> tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-multilingual-cased')
>>> model = DistilBertModel.from_pretrained('distilbert-base-multilingual-cased')
>>> 
>>> # Convert to ONNX
>>> from transformers.onnx import export
>>> export(tokenizer, model, 'onnx_config', 'onnx/nlp/')
```

### 2. Quantization

```python
from onnxruntime.quantization import quantize_dynamic

quantize_dynamic(
    model_input='onnx/nlp/model.onnx',
    model_output='onnx/nlp/model_quantized.onnx'
)
```

## Mobile Integration

### Android

1. Add ONNX Runtime to `build.gradle`:
```gradle
dependencies {
    implementation 'com.microsoft.onnxruntime:onnxruntime-android:1.16.0'
}
```

2. Load models in assets:
```kotlin
val model = OrtEnvironment.getEnvironment()
    .createSession(assetManager.open("model_quantized.onnx").readBytes())
```

### iOS

1. Add ONNX Runtime via CocoaPods:
```ruby
pod 'onnxruntime-objc', '~> 1.16.0'
```

2. Load models from bundle:
```swift
let session = try ORTSession(
    env: env,
    modelPath: Bundle.main.path(forResource: "model_quantized", ofType: "onnx")!
)
```

## Performance Benchmarks

### Target Metrics
- **TTS Latency**: < 500ms for 10 words
- **STT Latency**: < 300ms for 5 seconds of audio
- **NLP Latency**: < 100ms for text correction
- **Model Size**: 
  - TTS: < 100MB
  - STT: < 50MB
  - NLP: < 30MB

### Measuring Performance

```python
import time

# TTS Performance
start = time.time()
audio = tts_service.synthesize("Habari yako")
tts_time = time.time() - start
print(f"TTS: {tts_time:.3f}s")

# STT Performance
start = time.time()
text = stt_service.recognize(audio_data)
stt_time = time.time() - start
print(f"STT: {stt_time:.3f}s")

# NLP Performance
start = time.time()
corrected = nlp_service.correct(text)
nlp_time = time.time() - start
print(f"NLP: {nlp_time:.3f}s")
```

## Caching Strategies

### Audio Caching
Cache frequently used phrases:

```python
import hashlib
import pickle

class AudioCache:
    def __init__(self, cache_dir='cache/audio'):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
    
    def get_key(self, text):
        return hashlib.md5(text.encode()).hexdigest()
    
    def get(self, text):
        key = self.get_key(text)
        cache_file = f"{self.cache_dir}/{key}.pkl"
        if os.path.exists(cache_file):
            with open(cache_file, 'rb') as f:
                return pickle.load(f)
        return None
    
    def set(self, text, audio_data):
        key = self.get_key(text)
        cache_file = f"{self.cache_dir}/{key}.pkl"
        with open(cache_file, 'wb') as f:
            pickle.dump(audio_data, f)
```

### Model Caching
Pre-load models on app startup:

```python
class ModelManager:
    def __init__(self):
        self.tts_model = None
        self.stt_model = None
        self.nlp_model = None
    
    def load_all(self):
        """Load all models at startup"""
        self.tts_model = load_tts_model()
        self.stt_model = load_stt_model()
        self.nlp_model = load_nlp_model()
    
    def unload_all(self):
        """Free memory when not needed"""
        self.tts_model = None
        self.stt_model = None
        self.nlp_model = None
```

## Troubleshooting

### Model Too Large
- Use quantization (INT8 or INT4)
- Try model pruning
- Use smaller base model

### Slow Inference
- Enable GPU acceleration if available
- Reduce model complexity
- Use batch processing for multiple requests

### Poor Accuracy
- Test different quantization methods
- Verify model conversion is correct
- Consider using larger model with better optimization

## Further Optimization

### 1. Model Distillation
Train a smaller student model from the large teacher model.

### 2. Neural Architecture Search (NAS)
Find optimal model architecture for mobile deployment.

### 3. Hardware Acceleration
- Use NNAPI on Android
- Use Core ML on iOS
- Enable GPU/NPU when available

## Resources

- [ONNX Runtime Documentation](https://onnxruntime.ai/docs/)
- [Hugging Face Optimization](https://huggingface.co/docs/transformers/optimization)
- [Vosk Performance Tuning](https://alphacephei.com/vosk/adaptation)
- [Mobile ML Best Practices](https://www.tensorflow.org/lite/performance/best_practices)
