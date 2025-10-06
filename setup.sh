#!/bin/bash

# Kiswahili Voice App Setup Script
# This script sets up the development environment for the app

set -e

echo "======================================"
echo "Kiswahili Voice App Setup"
echo "======================================"
echo ""

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.x"
    exit 1
fi
echo "✅ Node.js version: $(node --version)"

# Check npm
echo "Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm version: $(npm --version)"

# Check Python
echo "Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python >= 3.8"
    exit 1
fi
echo "✅ Python version: $(python3 --version)"

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
npm install

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "======================================"
echo "Setup complete! 🎉"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Download Vosk Swahili model:"
echo "   cd backend/stt"
echo "   mkdir -p models"
echo "   cd models"
echo "   wget https://alphacephei.com/vosk/models/vosk-model-small-sw-0.1.zip"
echo "   unzip vosk-model-small-sw-0.1.zip"
echo ""
echo "2. Start the backend server:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "3. Start the React Native app:"
echo "   npm run android   # For Android"
echo "   npm run ios       # For iOS"
echo ""
echo "For more information, see README.md"
