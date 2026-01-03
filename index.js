import { slideVars } from "./src/index.ts";
import "./src/logo.ts";

// Tab switching
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    // Update buttons
    document.querySelectorAll(".tab-button").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");

    // Update content
    document.querySelectorAll(".tab-content").forEach((c) => {
      c.classList.remove("active");
      c.setAttribute("hidden", "");
    });
    const activeTab = document.getElementById(`${tab}-tab`);
    activeTab.classList.add("active");
    activeTab.removeAttribute("hidden");

    // Switch demo
    switchDemo(tab);
  });
});

let currentInstance = null;

function switchDemo(tab) {
  // Destroy existing instance
  if (currentInstance) {
    slideVars.destroy();
  }

  if (tab === "auto") {
    // Auto-detection demo (with one manual just for fun)
    slideVars.init(
      {
        "--shadow-size": {
          type: "slider",
          min: 3,
          max: 30,
          default: 10,
          unit: "px",
        },
      },
      {
        auto: true,
      }
    );
  } else {
    // Manual configuration demo
    slideVars.init({
      "--width": {
        type: "slider",
        min: 50,
        max: 400,
        default: 100,
        unit: "px",
        scope: "#manual-demo",
      },
      "--height": {
        type: "slider",
        min: 50,
        max: 400,
        default: 100,
        unit: "px",
        scope: "#manual-demo",
      },
      "--bg": {
        type: "color",
        default: "#667eea",
        scope: "#manual-demo",
      },
      "--radius": {
        type: "slider",
        min: 0,
        max: 200,
        default: 0,
        unit: "px",
        scope: "#manual-demo",
      },
    });
  }
}

// Initialize with auto-detection
switchDemo("auto");

// Update live CSS values
function updateLiveValues() {
  const liveValues = document.querySelectorAll(".live-value");
  // Read from body since that's where the component sets variables
  const styles = getComputedStyle(document.body);

  liveValues.forEach((span) => {
    const varName = span.dataset.var;
    if (varName) {
      const value = styles.getPropertyValue(varName).trim();
      span.textContent = value || "inherit";
    }
  });
}

// Update on initialization
setTimeout(updateLiveValues, 100);

// Watch for style changes on body element
const observer = new MutationObserver(() => {
  updateLiveValues();
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["style"],
});

// Also update periodically as a fallback
setInterval(updateLiveValues, 200);
