// background.js

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Inject content.js into the active tab
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
    console.log("Ripestat IP Highlighter injected into active tab.");
  } catch (error) {
    console.error("Failed to inject content.js:", error);
  }
});

