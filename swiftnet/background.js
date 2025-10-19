const stopWords = ['na', 'on', 'at', 'for', 'about', 'from', 'in', 'to', 'of', 'the'];

chrome.omnibox.onInputEntered.addListener((text) => {
  handleSmartSearch(text);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "toggleSearch") {
    chrome.storage.local.set({ searchEnabled: message.enabled });
  }
});

function handleSmartSearch(rawInput) {
  chrome.storage.local.get("searchEnabled", (data) => {
    if (!rawInput || rawInput.trim() === "") return;

    const query = rawInput.trim().toLowerCase();

  
    if (data.searchEnabled === false) {
      chrome.tabs.update({
        url: "https://www.bing.com/search?q=" + encodeURIComponent(query)
      });
      return;
    }

    
    const words = query.split(/\s+/);
    let filtered = words.filter(w => !stopWords.includes(w));

    if (filtered.length === 0) filtered = words;

    
    const cleanQuery = filtered.join("-");

    const targetUrl = `https://net.billionaire.life/${encodeURIComponent(cleanQuery)}`;
    chrome.tabs.update({ url: targetUrl });
  });
}
