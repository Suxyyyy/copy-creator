import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import RadialMenu from "./components/RadialMenu";
import "./styles/index.css";
import "./i18n";

const isRadialWindow = window.location.search.includes("radial=1");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isRadialWindow ? <RadialMenu /> : <App />}
  </React.StrictMode>
);
