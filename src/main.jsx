import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initDB } from "./db/dexieDB";

// Initialize database first
initDB().then(async () => {
  console.log("✅ Database initialized");

  // Start MSW in development mode
  if (import.meta.env.DEV) {
    import("./mocks/browser").then(({ worker }) => {
      worker
        .start({
          onUnhandledRequest: "bypass",
          serviceWorker: {
            url: "/mockServiceWorker.js",
          },
        })
        .then(() => {
          console.log("✅ MSW started");
          renderApp();
        })
        .catch((err) => {
          console.error("❌ MSW failed to start:", err);
          renderApp(); // Render anyway
        });
    });
  } else {
    renderApp();
  }
});

function renderApp() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
