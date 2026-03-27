import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Guard: never register service worker in iframes or Lovable preview
const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
})();

const hostname = window.location.hostname;
const isLovableHost =
  hostname === "lovableproject.com" || hostname.endsWith(".lovableproject.com");
const isPreviewHost =
  hostname.includes("id-preview--") || isLovableHost;

if (isPreviewHost || isInIframe) {
  navigator.serviceWorker?.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
}

createRoot(document.getElementById("root")!).render(<App />);
