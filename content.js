let overlay = null;
let input = null;

// --- Stop words i skraćene platforme ---
const stopWords = ['na', 'on', 'at', 'for', 'about', 'from'];
const platforms = {
  y: "https://www.youtube.com/results?search_query=",
  w: "https://en.wikipedia.org/wiki/Special:Search?search=",
  g: "https://www.google.com/search?q=",
  d: "https://duckduckgo.com/?q=",
  b: "https://www.bing.com/search?q=",
  a: "https://www.amazon.com/s?k=",
  p: "https://www.pinterest.com/search/pins/?q=",
  x: "https://x.com/search?q="
};
// --- kraj dodatka ---

function createOverlay() {
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.style = `
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    z-index: 999999;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    opacity: 0;
    transition: all 0.25s ease;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = "1";
    overlay.style.transform = "translate(-50%, -50%) scale(1)";
  }, 10);

  // Blue glass Spotlight background
  const shadowBox = document.createElement("div");
  shadowBox.style = `
    position: absolute;
    top: -16px; 
    left: -30px; 
    width: calc(112% + 32px); 
    height: 110px; 
    background: rgba(50, 120, 250, 0.2);
    backdrop-filter: blur(16px);
    border-radius: 25px;
    box-shadow: 0 0 30px rgba(50, 120, 250, 0.3);
    z-index: -1;
    pointer-events: none;
  `;
  overlay.appendChild(shadowBox);

  const searchContainer = document.createElement("div");
  searchContainer.style = `
    position: relative;
    width: 550px;
  `;

  input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search without been trucket";
  input.style = `
    width: 100%;
    padding: 16px 18px;
    border-radius: 30px;
    border: 1px solid rgba(0,0,0,0.1);
    font-size: 20px;
    outline: none;
    background: #fff;
    color: #222;
    transition: all 0.2s ease;
  `;

  input.addEventListener("focus", () => {});
  input.addEventListener("blur", () => {
    input.style.border = "1px solid rgba(0,0,0,0.1)";
  });

  searchContainer.appendChild(input);

  const footerLink = document.createElement("a");
  footerLink.href = "https://www.billionaire.life";
  footerLink.textContent = "www.billionaire.life";
  footerLink.target = "_blank";
  footerLink.style = `
    margin-top: 4px;
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    transition: color 0.2s ease;
    margin-left: 30px; 
  `;
  footerLink.addEventListener("mouseenter", () => (footerLink.style.color = "#ccc"));
  footerLink.addEventListener("mouseleave", () => (footerLink.style.color = "#fff"));

  overlay.appendChild(searchContainer);
  overlay.appendChild(footerLink);

  // --- Enter i Escape logika sa stopWords i skraćenim platformama + GPT ---
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const rawInput = input.value.trim().toLowerCase();
      if (!rawInput) return;

      let words = rawInput.split(/\s+/);
      let queryWords = [...words];
      let platformKey = null;
      let gptQuery = false;

      // GPT detekcija
      if (words.includes("gpt")) {
        gptQuery = true;
        queryWords = queryWords.filter(w => w !== "gpt");
      }

      // Platform shortcut
      for (let word of words) {
        if (platforms[word]) {
          platformKey = word;
          queryWords = queryWords.filter(w => w !== word);
          break;
        }
      }

      let filteredWords = queryWords.filter(w => !stopWords.includes(w));
      if (filteredWords.length === 0) filteredWords = queryWords;

      let cleanedQuery = filteredWords.join(" ");
      let fullQuery = encodeURIComponent(cleanedQuery.replace(/\s+/g, "-"));

      // GPT pretraga
      if (gptQuery) {
        window.location.href = `https://chat.openai.com/?q=${encodeURIComponent(cleanedQuery)}`;
        return;
      }

      // Pretraga po platformi
      if (platformKey && platforms[platformKey]) {
        let searchUrl = platforms[platformKey] + encodeURIComponent(cleanedQuery);
        if (platformKey === "p") searchUrl += "&rs=typed";
        window.location.href = searchUrl;
        return;
      }

      // Default - net.billionaire.life
      window.location.href = `https://net.billionaire.life/${encodeURIComponent(fullQuery)}`;
    } else if (e.key === "Escape") {
      removeOverlay();
    }
  });

  input.focus();
}

function removeOverlay() {
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.transform = "translate(-50%, -50%) scale(0.95)";
    setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.remove();
      overlay = null;
    }, 250);
  }
}

// Aktivacija overlay-a pritiskom na backtick `
document.addEventListener("keydown", (e) => {
  if (e.key === "`" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
    e.preventDefault();
    if (!overlay) createOverlay();
    else removeOverlay();
  }
});
