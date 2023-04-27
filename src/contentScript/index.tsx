import React from "react";
import { createRoot } from "react-dom/client";
import ContentScript from "./contentScript";
import "../assets/styles.css";
import { AuthProvider } from "../options/AuthContext";

// Enject button for upwork
import { TextAreaContainer, LabelAddContainer } from "./Upwork";

// Enject button for freelancer
import {
  TextAreaContainer as FreelancerEnjectButton,
  LabelAddContainer as FreelancerEnjectLabel,
} from "./Freelancer";

//Twitter button
import { EmbedTwitterButtons } from "./Twitter";
import Twitter from "./Twitter/Twitter";
import {
  EmbedButtonsInCommentBox,
  EmbedEmptyMessageBtn,
  EmbedLinkedinButtons,
} from "./Linkedin";
import Linkedin from "./Linkedin/Linkedin";

const hostName = window.location.hostname;

const LoadScript = () => {
  if (hostName === "www.upwork.com") {
    TextAreaContainer();
    LabelAddContainer();
  }

  if (hostName === "www.freelancer.com") {
    FreelancerEnjectButton();
    FreelancerEnjectLabel();
  }
  return null;
};

function init() {
  const appDiv = document.createElement("div");
  appDiv.id = "app69";
  document.body.appendChild(appDiv);

  if (!appDiv) {
    throw new Error("Can not find AppContainer");
  }
  const root = createRoot(appDiv);
  root.render(
    <AuthProvider>
      <LoadScript />
      <ContentScript />
    </AuthProvider>
  );
}

const isTwitter = hostName.includes("twitter.com");
const isLinkedin = hostName.includes("linkedin.com");

let loggedIn = "";
chrome.storage.sync.get("isLoggedin", (data) => {
  loggedIn = data.isLoggedin;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "isLoggedin") {
      loggedIn = newValue;
    }
  }
});

function SocialInit() {
  const isEmbeded = document.getElementById("twitterVakya69");
  if (isEmbeded) return;

  let isDarkMode = false;

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    // dark mode
    isDarkMode = true;
  }

  const appDiv = document.createElement("div");
  appDiv.id = "twitterVakya69";
  if (isTwitter) {
    EmbedTwitterButtons();
    appDiv.setAttribute(
      "style",
      "position: absolute; top: 26px; right: -103px; z-index: 999;"
    );
  }
  if (isLinkedin) {
    if (loggedIn) {
      EmbedLinkedinButtons();
      EmbedButtonsInCommentBox();
    } else {
      EmbedEmptyMessageBtn(isDarkMode);
    }
    appDiv.setAttribute(
      "style",
      "position: absolute; top: 28px; right: 0px; z-index: 999;"
    );
  }

  const btnVakya = document.getElementById("vakyaBtn69");
  // document.getElementById("vakyaCommentBtn69");
  // const shadow = btnVakya.attachShadow({ mode: "open" });
  btnVakya.appendChild(appDiv);
  const root = createRoot(appDiv);
  root.render(
    <AuthProvider>
      {isTwitter ? <Twitter /> : isLinkedin ? <Linkedin /> : null}
    </AuthProvider>
  );
}

const interval = setInterval(() => {
  const upworkCheck = document.querySelector(
    "[aria-labelledby='cover_letter_label']"
  );
  const freelancerCheck = document.getElementById("descriptionTextArea");
  const twitterCheck = document.querySelector('[data-testid="toolBar"]');
  const linkedinCheck = document.getElementsByClassName(
    "share-creation-state__additional-toolbar"
  );
  const conditionCheck =
    hostName === "www.upwork.com"
      ? upworkCheck
      : hostName === "www.freelancer.com"
      ? freelancerCheck
      : false;

  if ((isTwitter && twitterCheck) || (isLinkedin && linkedinCheck)) {
    SocialInit();
    // clearInterval(interval);
  } else if (conditionCheck) {
    init();
    clearInterval(interval);
  }
}, 400);
