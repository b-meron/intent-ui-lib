import React from "react";
import ReactDOM from "react-dom/client";
import DemoPage from "../DemoPage";
import "./main.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DemoPage />
  </React.StrictMode>
);

