chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (!msg || !msg.type) return;

  if (msg.type === 'OPEN_URL') {
    const url = msg.url;
    if (!url) return;

    // Ako je tab validan i http/https
    if (sender && sender.tab && sender.tab.id && sender.tab.url.startsWith('http')) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          func: (url) => { window.location.href = url; },
          args: [url]
        });
      } catch (err) {
        console.error('Error redirecting tab:', err);
      }
    } else {
      chrome.tabs.create({ url });
    }
  }
});

// Shortcut Alt+S — toggluje overlay
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-overlay') return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id || !tab.url || !tab.url.startsWith('http')) {
    console.warn('Overlay cannot be injected in this tab:', tab?.url);
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_OVERLAY' });
});
