#!/bin/bash

echo "Starting build process..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Navigate to client directory
echo "Navigating to client directory..."
cd client

# Install client dependencies
echo "Installing client dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

# Check if build was successful
if [ -f "dist/index.html" ]; then
    echo "Build successful! dist/index.html exists."
    ls -la dist/
else
    echo "Build failed! dist/index.html not found."
    exit 1
fi

echo "Build process completed." 