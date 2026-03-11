# BrowserBridge

BrowserBridge is a local browser automation interface that allows external systems such as AI agents, scripts, or workflow tools to control a real web browser through WebSocket commands.

Unlike traditional automation tools, BrowserBridge operates inside the user's actual browser session. This means it preserves:

- login sessions
- cookies
- local storage
- dynamically rendered pages

This makes it suitable for automating authenticated websites and modern JavaScript applications.

---

# Architecture

Controller (AI / scripts / n8n) communicates with the browser through a FastAPI WebSocket router.

```
Controller
    │
    │ WebSocket
    ▼
FastAPI Server
    │
    │ WebSocket
    ▼
Browser Extension
    │
    ▼
Browser Tabs / DOM
```

---

# Project Structure

```
browserbridge/
│
├── server/
│   └── main.py
│
├── extension/
│   ├── manifest.json
│   ├── background.js
│   └── content.js
│
├── client_test.py
├── requirements.txt
│
└── docs/
    └── commands.md
```

---

# Setup

## 1. Start the Python Server

Create and activate a virtual environment:

```
python -m venv venv
```

Activate it.

**Linux / Mac**

```
source venv/bin/activate
```

**Windows**

```
venv\Scripts\activate
```

Install dependencies:

```
pip install -r requirements.txt
```

Run the FastAPI server:

```
uvicorn main:app --reload --port 8000
```

WebSocket endpoints:

```
ws://localhost:8000/ws/browser
ws://localhost:8000/ws/controller
```

---

## 2. Install the Browser Extension

1. Open the Chrome extensions page:

```
chrome://extensions
```

2. Enable **Developer Mode**

3. Click **Load unpacked**

4. Select the `extension` folder

The extension will automatically connect to the server.

---

## 3. Test the System

Run the test controller:

```
python client_test.py
```

Example command sent to the browser:

```
{
  "type": "command",
  "id": "cmd_001",
  "action": "open_url",
  "params": {
    "url": "https://example.com"
  }
}
```

This will open the URL in a new browser tab.

---

# Documentation

Detailed command documentation is available in:

```
docs/commands.md
```

---

# Current Commands

- open_url
- get_html
- eval_js

Additional commands will be added in future versions.

---

# Roadmap

Upcoming improvements:

- command queue
- tab targeting
- page load waiting
- DOM query commands
- browser interaction commands
- AI automation support

---

# Status

This project is currently in early development.
