const WS_URL = "ws://localhost:8000/ws/browser";

let socket = null;

// setInterval(() => {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify({ type: "ping" }));
//   }
// }, 30000);

function connect() {
  console.log("Connecting to BrowserBridge...");

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("BrowserBridge connected");
  };

  socket.onmessage = async (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type !== "command") return;

    console.log("Command received:", msg);

    // HANDLE open_url FIRST
    if (msg.action === "open_url") {
      await chrome.tabs.create({
        url: msg.params.url,
      });

      socket.send(
        JSON.stringify({
          type: "result",
          id: msg.id,
          status: "success",
          data: "URL opened",
        }),
      );

      return;
    }

    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const tab = tabs[0];

    if (!tab) {
      socket.send(
        JSON.stringify({
          type: "result",
          id: msg.id,
          status: "error",
          data: "No active tab",
        }),
      );
      return;
    }

    chrome.tabs.sendMessage(tab.id, msg, (response) => {
      if (chrome.runtime.lastError) {
        socket.send(
          JSON.stringify({
            type: "result",
            id: msg.id,
            status: "error",
            data: chrome.runtime.lastError.message,
          }),
        );
        return;
      }

      socket.send(
        JSON.stringify({
          type: "result",
          id: msg.id,
          status: response.status,
          data: response.data,
        }),
      );
    });
  };

  socket.onclose = () => {
    console.log("Connection closed. Reconnecting...");
    setTimeout(connect, 2000);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };
}

connect();
