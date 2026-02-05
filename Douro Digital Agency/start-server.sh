#!/bin/bash

# Simple HTTP server for testing Douro Digital pages
# Avoids CORS issues with file:// protocol

PORT=8080

echo "Starting local HTTP server on port $PORT..."
echo "Base directory: /Users/imorgado/downloaded_sites"
echo ""
echo "Service pages available at:"
echo "  http://localhost:$PORT/html/ai-consulting.html"
echo "  http://localhost:$PORT/html/ai-solutions.html"
echo "  http://localhost:$PORT/html/custom-development.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd /Users/imorgado/downloaded_sites

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer $PORT
else
    echo "Error: Python not found. Please install Python to run the server."
    exit 1
fi
