import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";

const Popup = () => {
  return (
    <div>
      <p className="text-4xl text-red-400">Hey worls</p>
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
createRoot(container).render(<Popup />);
