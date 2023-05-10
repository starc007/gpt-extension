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
import { EmbedButtonsInCommentBox, EmbedLinkedinButtons } from "./Linkedin";
import Linkedin from "./Linkedin/Linkedin";
import LinkedinComment from "./Linkedin/LinkedinComment";
import { EmbedEmptyMessageBtn } from "./common";

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

// function getTheme() {
//   if (
//     window.matchMedia &&
//     window.matchMedia("(prefers-color-scheme:dark)").matches
//   ) {
//     return "dark";
//   } else {
//     return "light";
//   }
// }

function CommentInit() {
  const isCommentEmbeded = document.getElementById("vakyaCommentContainer69");
  if (isCommentEmbeded) return;

  const commentDiv = document.createElement("div");
  commentDiv.id = "vakyaCommentContainer69";

  // const theme = getTheme();
  // let isDarkMode = theme === "dark" ? true : false;

  if (isLinkedin) {
    if (loggedIn) {
      EmbedButtonsInCommentBox();
    } else {
      EmbedEmptyMessageBtn();
    }
    commentDiv.setAttribute(
      "style",
      "position: absolute; top: 34px; right: 119px; z-index: 999;"
    );
  }

  const commentButtons = document.getElementById("vakyaCommentBtn69");
  commentButtons?.appendChild(commentDiv);
  const commentRoot = createRoot(commentDiv);

  commentRoot.render(
    <AuthProvider>{isLinkedin ? <LinkedinComment /> : null}</AuthProvider>
  );
}

function SocialInit() {
  const isEmbeded = document.getElementById("containerVakya69");

  if (isEmbeded) return;

  // const theme = getTheme();

  // let isDarkMode = theme === "dark" ? true : false;

  const appDiv = document.createElement("div");

  appDiv.id = "containerVakya69";

  if (isTwitter) {
    if (loggedIn) {
      EmbedTwitterButtons();
    } else {
      EmbedEmptyMessageBtn();
    }
    appDiv.setAttribute(
      "style",
      "position: absolute; top: 31px; right: -103px; z-index: 999;"
    );
  }
  if (isLinkedin) {
    if (loggedIn) {
      EmbedLinkedinButtons();
      EmbedButtonsInCommentBox();
    } else {
      EmbedEmptyMessageBtn();
    }
    appDiv.setAttribute(
      "style",
      "position: absolute; top: 28px; right: 0px; z-index: 999;"
    );
  }

  const btnVakya = document.getElementById("vakyaBtn69");

  if (!btnVakya) return;
  btnVakya?.appendChild(appDiv);
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

  const commentButtons = document.querySelectorAll(
    "form.comments-comment-box__form"
  );
  const conditionCheck =
    hostName === "www.upwork.com"
      ? upworkCheck
      : hostName === "www.freelancer.com"
      ? freelancerCheck
      : false;

  if (commentButtons.length > 0) CommentInit();

  if (isTwitter || (isLinkedin && linkedinCheck)) {
    SocialInit();
    // clearInterval(interval);
  } else if (conditionCheck) {
    init();
    clearInterval(interval);
  }
}, 400);
