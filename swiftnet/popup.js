const switchBtn = document.getElementById("switch");
const statusLabel = document.getElementById("statusLabel");
const howtoLink = document.getElementById("howto");

// Učitaj stanje
chrome.storage.local.get("searchEnabled", (data) => {
  const enabled = data.searchEnabled !== false;
  updateSwitch(enabled);
});

// Klik na switch
switchBtn.addEventListener("click", () => {
  chrome.storage.local.get("searchEnabled", (data) => {
    const enabled = data.searchEnabled !== false;
    const newState = !enabled;
    chrome.storage.local.set({ searchEnabled: newState });
    chrome.runtime.sendMessage({ type: "toggleSearch", enabled: newState });
    updateSwitch(newState);
  });
});

// Klik na "How to use Extension"
howtoLink.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: "https://www.billionaire.life/addons.html" });
});

function updateSwitch(enabled) {
  if (enabled) {
    switchBtn.classList.add("active");
    statusLabel.textContent = "ON";
  } else {
    switchBtn.classList.remove("active");
    statusLabel.textContent = "OFF";
  }
}
