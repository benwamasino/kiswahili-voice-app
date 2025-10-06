# API Documentation

This document describes the backend API endpoints for the Kiswahili Voice App.

## Base URL

```
http://localhost:5000
```

For production, replace with your deployed backend URL.

## Endpoints

### 1. Health Check

Check if the backend service is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy"
}
```

**Status Codes:**
- `200 OK` - Service is running

**Example:**
```bash
curl http://localhost:5000/health
```

---

### 2. Text-to-Speech

Convert Swahili text to speech audio.

**Endpoint:** `POST /synthesize`

**Request Body:**
```json
{
  "text": "Habari yako"
}
```

**Response:**
```json
{
  "audio": "base64_encoded_audio_data"
}
```

**Status Codes:**
- `200 OK` - Audio generated successfully
- `400 Bad Request` - No text provided
- `500 Internal Server Error` - TTS processing error

**Example:**
```bash
curl -X POST http://localhost:5000/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Habari yako"}'
```

**Notes:**
- Audio is returned as base64-encoded WAV format
- Sample rate: 16000 Hz
- Maximum text length: 500 characters (recommended)

---

### 3. Speech-to-Text

Recognize speech from audio data.

**Endpoint:** `POST /recognize`

**Request Body:**
```json
{
  "audio": "base64_encoded_audio_data"
}
```

**Response:**
```json
{
  "text": "habari yako"
}
```

**Status Codes:**
- `200 OK` - Speech recognized successfully
- `400 Bad Request` - No audio data provided
- `500 Internal Server Error` - STT processing error

**Example:**
```bash
curl -X POST http://localhost:5000/recognize \
  -H "Content-Type: application/json" \
  -d '{"audio": "'"$(base64 audio.wav)"'"}'
```

**Notes:**
- Audio should be WAV format, 16000 Hz, mono
- Maximum audio length: 60 seconds
- Supported language: Swahili (sw-KE)

---

### 4. Grammar Correction

Correct grammar and spelling in Swahili text.

**Endpoint:** `POST /correct`

**Request Body:**
```json
{
  "text": "habari yako"
}
```

**Response:**
```json
{
  "corrected_text": "Habari yako.",
  "suggestions": [
    "Capitalized first letter",
    "Added period"
  ]
}
```

**Status Codes:**
- `200 OK` - Text corrected successfully
- `400 Bad Request` - No text provided
- `500 Internal Server Error` - NLP processing error

**Example:**
```bash
curl -X POST http://localhost:5000/correct \
  -H "Content-Type: application/json" \
  -d '{"text": "habari yako"}'
```

**Notes:**
- Performs basic grammar and punctuation corrections
- Returns list of corrections made
- Maximum text length: 1000 characters

---

### 5. Autocomplete

Get autocomplete suggestions for partial Swahili text.

**Endpoint:** `POST /autocomplete`

**Request Body:**
```json
{
  "text": "hab"
}
```

**Response:**
```json
{
  "suggestions": [
    "habari",
    "habarini"
  ]
}
```

**Status Codes:**
- `200 OK` - Suggestions generated successfully
- `400 Bad Request` - No text provided
- `500 Internal Server Error` - Processing error

**Example:**
```bash
curl -X POST http://localhost:5000/autocomplete \
  -H "Content-Type: application/json" \
  -d '{"text": "hab"}'
```

**Notes:**
- Returns up to 5 suggestions by default
- Suggestions are based on common Swahili words
- Case-insensitive matching

---

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

### Common Error Codes

- `400 Bad Request` - Invalid or missing parameters
- `500 Internal Server Error` - Server-side processing error
- `503 Service Unavailable` - Service temporarily unavailable

### Example Error Response

```json
{
  "error": "No text provided"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production:

- Recommended: 100 requests per minute per IP
- TTS/STT: 20 requests per minute per IP
- Autocomplete: 60 requests per minute per IP

---

## Authentication

Currently no authentication is required. For production:

- Implement API key authentication
- Use JWT tokens for user sessions
- Enable CORS for specific origins only

**Example with API Key:**
```bash
curl -X POST http://localhost:5000/synthesize \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"text": "Habari yako"}'
```

---

## Data Formats

### Audio Format

**Input (STT):**
- Format: WAV (PCM)
- Sample Rate: 16000 Hz
- Channels: Mono (1 channel)
- Bit Depth: 16-bit
- Encoding: Base64

**Output (TTS):**
- Format: WAV (PCM)
- Sample Rate: 16000 Hz
- Channels: Mono (1 channel)
- Bit Depth: 16-bit
- Encoding: Base64

### Text Format

- Encoding: UTF-8
- Language: Swahili (sw-KE)
- Maximum length: Varies by endpoint

---

## Performance

### Expected Latency

- Health check: < 10ms
- TTS (10 words): < 500ms
- STT (5 seconds): < 300ms
- Grammar correction: < 100ms
- Autocomplete: < 50ms

### Optimization Tips

1. **Batch Requests**: Combine multiple short texts for TTS
2. **Caching**: Cache common phrases on client side
3. **Compression**: Use gzip compression for audio data
4. **Connection Pooling**: Reuse HTTP connections

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

// Text-to-Speech
async function synthesize(text: string): Promise<string> {
  const response = await axios.post(`${API_BASE}/synthesize`, {text});
  return response.data.audio;
}

// Speech-to-Text
async function recognize(audioBase64: string): Promise<string> {
  const response = await axios.post(`${API_BASE}/recognize`, {
    audio: audioBase64
  });
  return response.data.text;
}

// Grammar Correction
async function correct(text: string) {
  const response = await axios.post(`${API_BASE}/correct`, {text});
  return response.data;
}

// Autocomplete
async function autocomplete(text: string): Promise<string[]> {
  const response = await axios.post(`${API_BASE}/autocomplete`, {text});
  return response.data.suggestions;
}
```

### Python

```python
import requests
import base64

API_BASE = 'http://localhost:5000'

# Text-to-Speech
def synthesize(text):
    response = requests.post(
        f'{API_BASE}/synthesize',
        json={'text': text}
    )
    return response.json()['audio']

# Speech-to-Text
def recognize(audio_path):
    with open(audio_path, 'rb') as f:
        audio_base64 = base64.b64encode(f.read()).decode()
    
    response = requests.post(
        f'{API_BASE}/recognize',
        json={'audio': audio_base64}
    )
    return response.json()['text']

# Grammar Correction
def correct(text):
    response = requests.post(
        f'{API_BASE}/correct',
        json={'text': text}
    )
    return response.json()

# Autocomplete
def autocomplete(text):
    response = requests.post(
        f'{API_BASE}/autocomplete',
        json={'text': text}
    )
    return response.json()['suggestions']
```

### cURL

```bash
# Text-to-Speech
curl -X POST http://localhost:5000/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Habari yako"}' \
  | jq -r '.audio' \
  | base64 -d > output.wav

# Speech-to-Text
curl -X POST http://localhost:5000/recognize \
  -H "Content-Type: application/json" \
  -d "{\"audio\": \"$(base64 input.wav)\"}" \
  | jq -r '.text'

# Grammar Correction
curl -X POST http://localhost:5000/correct \
  -H "Content-Type: application/json" \
  -d '{"text": "habari yako"}'

# Autocomplete
curl -X POST http://localhost:5000/autocomplete \
  -H "Content-Type: application/json" \
  -d '{"text": "hab"}'
```

---

## Testing

### Unit Tests

Run backend tests:
```bash
cd backend
pytest tests/
```

### Integration Tests

Test full API flow:
```bash
cd backend
pytest tests/integration/
```

### Load Testing

Use Apache Bench:
```bash
ab -n 100 -c 10 \
  -p test_data.json \
  -T application/json \
  http://localhost:5000/synthesize
```

---

## Monitoring

### Logging

Logs are written to `backend/logs/app.log`:

```python
import logging

logging.basicConfig(
    filename='logs/app.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Metrics

Monitor these metrics:
- Request rate (requests/minute)
- Error rate (errors/total requests)
- Response time (p50, p95, p99)
- Model inference time

---

## Support

For API issues:
- Check service health: `GET /health`
- Review logs: `backend/logs/app.log`
- Test with curl examples above
- Report issues on GitHub

---

## Changelog

### Version 1.0.0 (2025-01-01)
- Initial API release
- TTS, STT, and NLP endpoints
- Basic error handling
- Documentation

### Future Versions
- API authentication
- Rate limiting
- Batch processing
- WebSocket support for streaming
