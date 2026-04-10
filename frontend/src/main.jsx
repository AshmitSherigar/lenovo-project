import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: Infinity,
        style: {
          background: "#18181b",
          color: "#fafafa",
          border: "1px solid #27272a",
          fontSize: "0.8125rem",
          fontFamily: "'Inter', sans-serif",
        },
      }}
      theme="dark"
      richColors
      expand={false}
      visibleToasts={6}
      closeButton
    />
  </React.StrictMode>,
);
