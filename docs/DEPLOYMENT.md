# Deployment Guide

This guide covers deploying the Kiswahili Voice App to production environments.

## Prerequisites

- Completed development and testing
- Optimized models (see MODEL_OPTIMIZATION.md)
- Signed release keys for Android/iOS

## Android Deployment

### 1. Generate Release Keystore

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore kiswahili-release.keystore \
  -alias kiswahili-voice-app \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### 2. Configure Build

Edit `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('kiswahili-release.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias 'kiswahili-voice-app'
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }
}
```

### 3. Build Release APK

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### 4. Build Release Bundle (for Play Store)

```bash
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### 5. Upload to Google Play

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Upload AAB file
4. Complete store listing
5. Submit for review

## iOS Deployment

### 1. Configure Xcode Project

```bash
cd ios
pod install
open KiswahiliVoiceApp.xcworkspace
```

### 2. Set Signing & Capabilities

- Select project in Xcode
- Choose your team
- Enable automatic signing
- Add required capabilities

### 3. Configure Build Settings

Edit `ios/KiswahiliVoiceApp/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>App needs microphone access for speech recognition</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>App needs speech recognition for voice input</string>
```

### 4. Build for Release

```bash
# Archive the app
xcodebuild archive \
  -workspace KiswahiliVoiceApp.xcworkspace \
  -scheme KiswahiliVoiceApp \
  -archivePath build/KiswahiliVoiceApp.xcarchive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/KiswahiliVoiceApp.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist
```

### 5. Upload to App Store

1. Open Xcode
2. Select Archive
3. Click "Distribute App"
4. Follow prompts to upload

## Backend Deployment

### Option 1: Standalone Flask Server

For testing or small deployments:

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Option 2: Docker Container

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

Build and run:

```bash
docker build -t kiswahili-backend .
docker run -p 5000:5000 kiswahili-backend
```

### Option 3: On-Device Backend

For fully offline operation, the backend runs on the device:

#### Android

Use [Chaquopy](https://chaquo.com/chaquopy/) to embed Python:

```gradle
plugins {
    id 'com.chaquo.python'
}

chaquopy {
    defaultConfig {
        version "3.8"
    }
}
```

#### iOS

Use [PythonKit](https://github.com/pvieito/PythonKit):

```swift
import PythonKit

let sys = Python.import("sys")
sys.path.append(Bundle.main.bundlePath)

let tts = Python.import("tts.tts_service")
let service = tts.TTSService()
```

## Cloud Deployment (Optional)

For optional cloud-enhanced features:

### AWS EC2

1. Launch EC2 instance (t3.medium recommended)
2. Install dependencies
3. Configure security groups (port 5000)
4. Run backend service

### Google Cloud Run

```bash
# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/kiswahili-backend

# Deploy
gcloud run deploy kiswahili-backend \
  --image gcr.io/PROJECT_ID/kiswahili-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Heroku

```bash
# Create Procfile
echo "web: gunicorn app:app" > backend/Procfile

# Deploy
cd backend
heroku create kiswahili-voice-app
git push heroku main
```

## Model Deployment

### Include Models in App Bundle

#### Android
Place models in `android/app/src/main/assets/models/`:
```
assets/
  models/
    vosk-model-small-sw-0.1/
    tts-model-quantized.onnx
```

#### iOS
Add models to Xcode project resources.

### Download Models on First Launch

```typescript
import RNFS from 'react-native-fs';

async function downloadModels() {
  const models = [
    {
      name: 'vosk-sw',
      url: 'https://example.com/vosk-model-small-sw-0.1.zip',
      size: 40000000
    },
    {
      name: 'tts',
      url: 'https://example.com/tts-model-quantized.onnx',
      size: 95000000
    }
  ];

  for (const model of models) {
    const path = `${RNFS.DocumentDirectoryPath}/models/${model.name}`;
    await RNFS.downloadFile({
      fromUrl: model.url,
      toFile: path,
      progressDivider: 1,
      begin: (res) => console.log(`Downloading ${model.name}...`),
      progress: (res) => {
        const progress = (res.bytesWritten / model.size) * 100;
        console.log(`Progress: ${progress}%`);
      }
    }).promise;
  }
}
```

## Performance Monitoring

### Sentry Integration

```bash
npm install @sentry/react-native
```

```javascript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableNative: true,
});
```

### Analytics

```bash
npm install @react-native-firebase/analytics
```

```javascript
import analytics from '@react-native-firebase/analytics';

analytics().logEvent('tts_request', {
  text_length: text.length,
  duration: synthesisTime
});
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build Android
        run: |
          cd android
          ./gradlew assembleRelease

  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build iOS
        run: |
          cd ios
          pod install
          xcodebuild -workspace KiswahiliVoiceApp.xcworkspace \
            -scheme KiswahiliVoiceApp archive
```

## Security Considerations

### API Keys
- Never commit API keys
- Use environment variables
- Rotate keys regularly

### Model Security
- Encrypt models if containing sensitive data
- Verify model checksums on download
- Use HTTPS for all downloads

### Data Privacy
- All data stays on device
- No telemetry without consent
- Clear privacy policy

## Testing in Production

### Beta Testing

#### Android
Use Google Play Internal Testing:
1. Upload APK/AAB to Internal Testing track
2. Add testers by email
3. Share test link

#### iOS
Use TestFlight:
1. Upload build to App Store Connect
2. Add internal/external testers
3. Distribute via TestFlight app

### Monitoring

Monitor key metrics:
- Crash rate
- API response times
- Model inference times
- User engagement

## Rollback Procedures

### Android
1. Keep previous APK/AAB versions
2. Use Play Console to roll back
3. Monitor crash reports

### iOS
1. Submit new build with fixes
2. Use phased release to limit impact
3. Emergency hotfix through expedited review

## Post-Deployment

### User Feedback
- Monitor app store reviews
- Set up in-app feedback mechanism
- Track feature requests

### Performance Optimization
- Monitor inference times
- Identify bottlenecks
- Optimize based on real usage

### Updates
- Regular model updates
- Bug fixes and improvements
- Feature additions based on feedback

## Support

For deployment issues:
- Check logs in `backend/logs/`
- Review crash reports
- Test on various devices
- Consult community forums
