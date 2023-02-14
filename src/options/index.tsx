import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import "../assets/styles.css";

import Options from "./options";

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  createRoot(container).render(<Options />);
}

init();
