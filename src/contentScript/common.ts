import { PLATFORMS } from "./config";

export function addLoading(isLinkedIn: boolean) {
  const func = (buttons) => {
    if (!buttons) {
      return null;
    }

    buttons.style.opacity = 0.6;
    buttons.style.pointerEvents = "none";
  };

  if (isLinkedIn) {
    const commentButtons = document.querySelectorAll(
      "form.comments-comment-box__form"
    );
    commentButtons.forEach((commentButton) => {
      const buttons = commentButton.querySelector(".vakyaCommentBtn69");
      func(buttons);
    });
  } else {
    const buttons = document.getElementById("vakyaBtn69");
    func(buttons);
  }
}

export function removeLoading(isLinkedIn: boolean) {
  const func = (buttons) => {
    if (!buttons) {
      return null;
    }

    buttons.style.opacity = 1;
    buttons.style.pointerEvents = "auto";
  };

  if (isLinkedIn) {
    const commentButtons = document.querySelectorAll(
      "form.comments-comment-box__form"
    );
    commentButtons.forEach((commentButton) => {
      const buttons = commentButton.querySelector(".vakyaCommentBtn69");
      func(buttons);
    });
  } else {
    const buttons = document.getElementById("vakyaBtn69");
    func(buttons);
  }
}

export const EmbedEmptyMessageBtn = () => {
  // Use Vakya for creating posts through AI
  const isLinkedin = window.location.origin.includes("linkedin.com");
  const isButtonsEmbeded = document.getElementById("vakyaBtn69");
  if (isButtonsEmbeded) {
    return;
  }

  const toolbar = isLinkedin
    ? document.querySelector(".share-creation-state__additional-toolbar")
    : document.querySelector('[data-testid="toolBar"]');

  if (!toolbar && !isLinkedin) {
    if (!toolbar) {
      requestAnimationFrame(EmbedEmptyMessageBtn);
      return;
    }
  }

  // const isBox = document.getElementsByClassName(
  //   "share-box"
  // ) as HTMLCollectionOf<HTMLElement>;
  const url = chrome.runtime.getURL("icon.png");
  const NologinBtn = document.createElement("a");
  NologinBtn.href = "https://test.vakya.ai";
  NologinBtn.target = "_blank";
  NologinBtn.innerHTML =
    "<span style='color: #7F56D9; font-weight: 700; margin-right:3px'>Use Vakya </span> for creating posts through AI";
  NologinBtn.id = "NologinBtn69";
  NologinBtn.setAttribute(
    "style",
    `cursor: pointer; color: #7F56D9; background: transparent; padding: 4px 8px; font-size: 13px; font-size: 13px; width:303px ;display:flex;`
  );
  const img = document.createElement("img");
  img.setAttribute("style", "width: 20px; height: 20px; margin-left: 8px;");
  img.src = url;
  NologinBtn.appendChild(img);

  const buttons = document.createElement("div");
  buttons.id = "vakyaBtn69";
  buttons.setAttribute(
    "style",
    "display: flex; align-items: center; height: 100%; margin-top: 8px; position: relative;"
  );
  buttons.appendChild(NologinBtn);

  if (isLinkedin) {
    toolbar.appendChild(buttons);
  } else {
    toolbar.firstElementChild.setAttribute("style", "margin-top: 9px;");
    toolbar.lastElementChild.setAttribute("style", "margin-top: 9px;");
    toolbar.parentNode.prepend(buttons);
  }
};
