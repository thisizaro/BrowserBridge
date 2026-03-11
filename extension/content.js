console.log("BrowserBridge content script loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "command") return;

  console.log("Content script received:", msg);

  if (msg.action === "get_html") {
    const html = document.documentElement.outerHTML;

    sendResponse({
      status: "success",
      data: html,
    });
  }

  if (msg.action === "eval_js") {
    try {
      const result = Function('"use strict"; return (' + msg.params.code + ")")();

      sendResponse({
        status: "success",
        data: result,
      });
    } catch (err) {
      sendResponse({
        status: "error",
        data: err.toString(),
      });
    }
  }

  return true;
});
