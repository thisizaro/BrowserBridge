# BrowserBridge Command Protocol

## Overview

BrowserBridge uses WebSocket JSON messages to communicate between the controller and the browser worker.

All commands follow a consistent message format.

Controller → FastAPI → Browser Extension
Browser Extension → FastAPI → Controller

---

## Message Structure

### Command Message

Sent by the controller.

```json
{
  "type": "command",
  "id": "unique-command-id",
  "action": "command_name",
  "params": {}
}
```

#### Fields

| Field  | Type   | Description               |
| ------ | ------ | ------------------------- |
| type   | string | message type (`command`)  |
| id     | string | unique command identifier |
| action | string | command to execute        |
| params | object | command parameters        |

---

### Result Message

Returned by the browser worker.

```json
{
  "type": "result",
  "id": "unique-command-id",
  "status": "success",
  "data": {}
}
```

#### Fields

| Field  | Type   | Description             |
| ------ | ------ | ----------------------- |
| type   | string | message type (`result`) |
| id     | string | original command id     |
| status | string | `success` or `error`    |
| data   | any    | command result          |

---

# Available Commands (MVP)

## 1. `open_url`

### Description

Opens a URL in a new browser tab.

### Command

```json
{
  "type": "command",
  "id": "cmd_001",
  "action": "open_url",
  "params": {
    "url": "https://example.com"
  }
}
```

### Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| url       | string | yes      | URL to open |

### Response

```json
{
  "type": "result",
  "id": "cmd_001",
  "status": "success",
  "data": "URL opened"
}
```

### Behavior

- Opens a new browser tab
- Navigates to the specified URL

---

## 2. `get_html`

### Description

Returns the rendered HTML of the current page.

### Command

```json
{
  "type": "command",
  "id": "cmd_002",
  "action": "get_html",
  "params": {}
}
```

### Parameters

None.

### Response

```json
{
  "type": "result",
  "id": "cmd_002",
  "status": "success",
  "data": "<html>...</html>"
}
```

### Behavior

Runs inside the page and extracts the DOM HTML.

Equivalent browser code:

```javascript
document.documentElement.outerHTML;
```

---

## 3. `eval_js`

### Description

Executes custom JavaScript in the page context.

### Command

```json
{
  "type": "command",
  "id": "cmd_003",
  "action": "eval_js",
  "params": {
    "code": "document.title"
  }
}
```

### Parameters

| Parameter | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| code      | string | yes      | JavaScript expression to execute |

### Response

```json
{
  "type": "result",
  "id": "cmd_003",
  "status": "success",
  "data": "Page Title"
}
```

### Behavior

The JavaScript is executed inside the page environment.

---

## 4. `ping`

### Description

Used to maintain the WebSocket connection.

### Command

```json
{
  "type": "ping"
}
```

### Response

None required.

This is sent periodically by the browser worker.

---

# Error Responses

If a command fails, the extension returns:

```json
{
  "type": "result",
  "id": "cmd_123",
  "status": "error",
  "data": "error message"
}
```

Example:

`No active tab`

---

# Example Command Flow

### Controller Sends

```json
{
  "type": "command",
  "id": "abc123",
  "action": "get_html",
  "params": {}
}
```

### Browser Executes

```javascript
document.documentElement.outerHTML;
```

### Browser Returns

```json
{
  "type": "result",
  "id": "abc123",
  "status": "success",
  "data": "<html>...</html>"
}
```

---

# WebSocket Endpoints

BrowserBridge uses two WebSocket connections.

### Browser Worker

```
ws://localhost:8000/ws/browser
```

### Controller

```
ws://localhost:8000/ws/controller
```

---

# Future Commands (Planned)

These will be added in later phases.

| Command            | Description               |
| ------------------ | ------------------------- |
| query_selector     | extract element text      |
| query_selector_all | extract multiple elements |
| click              | click element             |
| type               | type into input           |
| scroll             | scroll page               |
| wait_for_selector  | wait for element          |
| screenshot         | capture page              |

---

# Example Python Controller

Example usage:

```python
command = {
    "type": "command",
    "id": "test_1",
    "action": "open_url",
    "params": {
        "url": "https://example.com"
    }
}
```
