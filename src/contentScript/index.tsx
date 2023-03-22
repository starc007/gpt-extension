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

const interval = setInterval(() => {
  const upworkCheck = document.querySelector(
    "[aria-labelledby='cover_letter_label']"
  );
  const freelancerCheck = document.getElementById("descriptionTextArea");

  const conditionCheck =
    hostName === "www.upwork.com"
      ? upworkCheck
      : hostName === "www.freelancer.com"
      ? freelancerCheck
      : false;

  if (conditionCheck) {
    init();
    clearInterval(interval);
  }
}, 400);
