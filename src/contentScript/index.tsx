import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import ContentScript from "./contentScript";
import "../assets/styles.css";

const TextAreaContainer = () => {
  const appContainer = document.createElement("div");
  appContainer.id = "little69";

  appContainer.innerHTML =
    '<button id="littleIcn69"><img style="width: 20px; height: 20px;" src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/60/null/external-astronaut-space-vitaliy-gorbachev-lineal-color-vitaly-gorbachev-4.png" /></button > ';

  const css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML =
    "#little69 { position: relative; } #littleIcn69 { position: absolute; bottom: 14px; left: 13px; width: 20px; height: 20px; border-radius: 50%; background-color: none; border: none; outline: none; cursor: pointer; z-index: 9999; }";

  const textArea = document.querySelector(
    "[aria-labelledby='cover_letter_label']"
  );
  const parentEle = textArea?.parentElement;
  parentEle?.insertBefore(appContainer, textArea);
  parentEle?.removeChild(textArea);
  appContainer.appendChild(textArea);
  appContainer.appendChild(css);
};

const LabelAddContainer = () => {
  const appContainer = document.createElement("div");
  appContainer.innerHTML = "<button id='ctOpen69'>Chat Gpt3</button>";
  appContainer.id = "ctn69";

  const css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML =
    "#ctn69 { display: flex; justify-content: space-between; align-items: end; margin-bottom: 10px; } #ctOpen69 { background-color: #0D6EFD; color: #fff; border: none; border-radius: 8px; width: 120px; height: 38px; cursor: pointer; outline: none; }";

  const label = document.getElementById("cover_letter_label");
  const parentEle = label?.parentElement;
  parentEle?.insertBefore(appContainer, label);
  parentEle?.removeChild(label);
  appContainer.insertBefore(label, appContainer.firstChild);

  appContainer.appendChild(css);
};

function init() {
  const appDiv = document.createElement("div");
  appDiv.id = "app69";
  document.body.appendChild(appDiv);

  TextAreaContainer();
  LabelAddContainer();

  if (!appDiv) {
    throw new Error("Can not find AppContainer");
  }
  const root = createRoot(appDiv);
  root.render(
    <Router>
      <ContentScript />
    </Router>
  );
}

const interval = setInterval(() => {
  if (document.querySelector("[aria-labelledby='cover_letter_label']")) {
    init();
    clearInterval(interval);
  }
}, 500);
