import React from "react";
import { createRoot } from "react-dom/client";
import ContentScript from "./contentScript";
import "../assets/styles.css";
import { AuthProvider } from "../options/AuthContext";

const TextAreaContainer = () => {
  const appContainer = document.createElement("div");
  appContainer.id = "little69";

  const url = chrome.runtime.getURL("icon.png");

  appContainer.innerHTML =
    '<button id="littleIcn69"><img style="width: 20px; height: 20px;" src=" ' +
    url +
    '" /></button > ';

  const css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML =
    "#little69 { position: relative; } #littleIcn69 { position: absolute; bottom: 11px; left: 11px; background: none; border: none; outline: none; cursor: pointer; }";

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
  appContainer.innerHTML =
    "<button id='ctOpen69'><span style='color:#7F56D9'>Use Vakya</span> for writing Cover letter through AI</button>";
  appContainer.id = "ctn69";

  const css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML =
    "#ctn69 { display: flex; justify-content: space-between; align-items: center; } #ctOpen69 { color: #000; margin:0; white-space: nowrap}";

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
    <AuthProvider>
      <ContentScript />
    </AuthProvider>
  );
}

const interval = setInterval(() => {
  if (document.querySelector("[aria-labelledby='cover_letter_label']")) {
    init();
    clearInterval(interval);
  }
}, 400);
