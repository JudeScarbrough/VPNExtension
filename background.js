chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received:", message);

  if (message.type === "connect" && message.ip && message.port) {
      const proxyConfig = {
          mode: "fixed_servers",
          rules: {
              singleProxy: {
                  scheme: "http",
                  host: message.ip,
                  port: parseInt(message.port)
              }
          }
      };

      chrome.proxy.settings.set({ value: proxyConfig, scope: "regular" }, () => {
          chrome.storage.local.set({ proxyEnabled: true, proxyIP: message.ip }, () => {
              sendResponse({ status: `Connected to ${message.ip}:${message.port}` });
          });
      });

  } else if (message.type === "disconnect") {
      chrome.proxy.settings.clear({ scope: "regular" }, () => {
          chrome.storage.local.set({ proxyEnabled: false, proxyIP: "" }, () => {
              sendResponse({ status: "Proxy Disconnected" });
          });
      });

  } else if (message.type === "status") {
      chrome.storage.local.get(["proxyEnabled", "proxyIP"], (data) => {
          console.log("Storage data retrieved:", data);
          sendResponse({
              type: "status",
              connected: !!data.proxyEnabled, // Ensure boolean value
              IP: data.proxyIP || "" // Ensure IP is string or empty
          });
      });

      return true; // Required for async `sendResponse`
  }

  return true; // Keep response channel open for async responses
});
