import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";

const Options = () => {
  return (
    <div>
      <p className="text-4xl text-red-400">Hey Options</p>
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
createRoot(container).render(<Options />);
