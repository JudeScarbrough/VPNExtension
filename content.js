window.addEventListener("message", function(event) {
    if (event.source !== window) return;

    if (event.data.type === "FROM_PAGE") {
        //console.log("Content script received message:", event.data.text);

        chrome.runtime.sendMessage(event.data.text, function(response) {
            if (chrome.runtime.lastError) {
                console.error("Error sending message to background:", chrome.runtime.lastError.message);
                return;
            }

            //console.log("Response from background:", response);

            if (response) {
                window.postMessage({ type: "TO_PAGE", text: response }, "*");
            } else {
                window.postMessage({ type: "TO_PAGE", text: { error: "No response received" } }, "*");
            }
        });
    }
}, false);
