import { addLoading, removeLoading } from "../common";
import { PLATFORMS, TONE_IDS } from "../config";

let isLinkedIn = window.location.origin.includes("linkedin.com");

export const EmbedLinkedinButtons = () => {
  const isButtonsEmbeded = document.getElementById("vakyaBtn69");
  if (isButtonsEmbeded) {
    return;
  }

  const toolbar = document.getElementsByClassName(
    "share-creation-state__additional-toolbar"
  );

  const isBox = document.getElementsByClassName(
    "share-box"
  ) as HTMLCollectionOf<HTMLElement>;

  if (isBox.length > 0) {
    const funnyBtn = document.createElement("div");
    funnyBtn.innerHTML = "😂 Funny";
    funnyBtn.id = "funnyBtn69";
    funnyBtn.setAttribute(
      "style",
      "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 4px 8px; font-size: 12px; font-weight: 700; width:75px"
    );

    const interestingBtn = document.createElement("button");
    interestingBtn.innerHTML = "😲 Interesting";
    interestingBtn.id = "interestingBtn69";
    interestingBtn.setAttribute(
      "style",
      "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; font-weight: 700; border-radius: 9999px; padding: 4px 8px; font-size: 12px; margin-left: 8px; width:110px"
    );
    const qaBtn = document.createElement("div");
    qaBtn.innerHTML = "🤓 Q/A";
    qaBtn.id = "qaBtn69";
    qaBtn.setAttribute(
      "style",
      "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 4px 8px; font-size: 12px; font-weight: 700;  margin-left: 8px; width: 60px"
    );
    const regenerate = document.createElement("div");
    regenerate.id = "regenerateBtn69";
    const img1 = document.createElement("img");
    img1.src = chrome.runtime.getURL("generatePrimary.png");
    img1.setAttribute("style", "width: 17px; height: 17px;");
    regenerate.appendChild(img1);
    regenerate.setAttribute(
      "style",
      "cursor: pointer; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 4px 8px;  margin-left: 8px; width: 36px"
    );

    const moreBtn = document.createElement("div");
    moreBtn.innerHTML = "More";
    moreBtn.id = "moreBtn69";
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("downArrow.png");
    img.setAttribute("style", "width: 10px; height: 7px; margin-left: 4px;");
    moreBtn.appendChild(img);
    moreBtn.setAttribute(
      "style",
      "cursor:pointer; background: #F9F5FF; border: none; color: #7F56D9; font-size: 12px; font-weight: 600; border-radius:9999px; padding: 4px 10px; margin-left: 8px; display: flex; align-items: center;"
    );

    const buttons = document.createElement("div");
    buttons.id = "vakyaBtn69";
    buttons.setAttribute(
      "style",
      "display: flex; align-items: center; height: 100%; margin-top: 8px; position: relative;"
    );

    buttons.appendChild(funnyBtn);
    buttons.appendChild(interestingBtn);
    buttons.appendChild(qaBtn);
    buttons.appendChild(regenerate);
    buttons.appendChild(moreBtn);
    toolbar[0].appendChild(buttons);
  }
};

function getLinkedInText(elem: any) {
  const text = elem
    .closest(".feed-shared-update-v2")
    .querySelector(".feed-shared-update-v2__description")
    .textContent.trim()
    .replaceAll("\n", "")
    .replaceAll("…see more", "");
  return text;
}

function sendServerRequest(toneId: string, text: string, linkElem: any) {
  const PromptData = {
    prompt: text,
    toneId: toneId,
    maxTokens: 100,
    numResponses: 1,
    categoryInfoId: PLATFORMS.LINKEDIN,
    meta: {
      source: PLATFORMS.LINKEDIN,
      description: "replied to post",
    },
  };

  var port = chrome.runtime.connect({ name: "vakya" });
  linkElem.textContent = "Writing......";
  port.postMessage({ type: "getPrompt", promptData: PromptData });
  addLoading(isLinkedIn);
  port.onMessage.addListener((msg) => {
    if (msg.message === "done") {
      removeLoading(isLinkedIn);
      return;
    } else if (msg.message === "success") {
      const { data } = msg;
      let prevText = linkElem?.textContent;
      if (prevText === text) prevText = "";
      if (prevText?.includes("undefined")) {
        prevText = prevText?.replace("undefined", " ");
      }
      if (data?.includes("undefined")) {
        prevText = data?.replace("undefined", " ");
      }
      if (prevText === "Writing......") prevText = " ";
      let txt = prevText + data;
      txt = txt.replaceAll("undefined", " ");
      linkElem.textContent = txt;
    }
  });
}

export const EmbedButtonsInCommentBox = () => {
  const commentButtons = document.querySelectorAll(
    "form.comments-comment-box__form"
  );

  Array.from(commentButtons).forEach((b) => {
    if (b.querySelector(".vakyaCommentBtn69")) {
      return;
    }

    const agreeBtn = document.createElement("div");
    agreeBtn.innerHTML = "👍";
    agreeBtn.id = "agreeBtn69";
    agreeBtn.setAttribute(
      "style",
      "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 4px 14px; font-size: 12px; font-weight: 700;"
    );
    agreeBtn.addEventListener("click", (e) => {
      const text = getLinkedInText(e.target);
      const elem = b.querySelector(".ql-editor");
      sendServerRequest(TONE_IDS.LIKE, text, elem);
    });

    const disagreeBtn = document.createElement("div");
    disagreeBtn.innerHTML = "👎";
    disagreeBtn.id = "disagreeBtn69";
    disagreeBtn.setAttribute(
      "style",
      "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 4px 14px; font-size: 12px; font-weight: 700;  margin-left: 8px;"
    );

    disagreeBtn.addEventListener("click", (e) => {
      const text = getLinkedInText(e.target);
      const elem = b.querySelector(".ql-editor");
      sendServerRequest(TONE_IDS.DISLIKE, text, elem);
    });

    const supportBtn = document.createElement("div");
    supportBtn.innerHTML = "🫶 Support";
    supportBtn.id = "supportBtn69";
    supportBtn.setAttribute(
      "style",
      "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 4px 14px; font-size: 12px; font-weight: 700;  margin-left: 8px;"
    );

    supportBtn.addEventListener("click", (e) => {
      const text = getLinkedInText(e.target);
      const elem = b.querySelector(".ql-editor");
      sendServerRequest(TONE_IDS.SUPPORT, text, elem);
    });

    const funnyBtn = document.createElement("div");
    funnyBtn.innerHTML = "😂 Joke";
    funnyBtn.id = "funnyCommentBtn69";
    funnyBtn.setAttribute(
      "style",
      "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 4px 8px; font-size: 12px; font-weight: 700; margin-left: 8px;"
    );

    funnyBtn.addEventListener("click", (e) => {
      const text = getLinkedInText(e.target);
      const elem = b.querySelector(".ql-editor");
      sendServerRequest(TONE_IDS.FUNNY, text, elem);
    });

    const questionBtn = document.createElement("div");
    questionBtn.innerHTML = "🤓 Question";
    questionBtn.id = "questionBtn69";
    questionBtn.setAttribute(
      "style",
      "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; font-weight: 700; border-radius: 9999px; padding: 4px 8px; font-size: 12px; margin-left: 8px;"
    );
    questionBtn.addEventListener("click", (e) => {
      const text = getLinkedInText(e.target);
      const elem = b.querySelector(".ql-editor");
      sendServerRequest(TONE_IDS.QUESTION, text, elem);
    });

    const moreBtn = document.createElement("div");
    moreBtn.innerHTML = "More";
    moreBtn.id = "moreCommentBtn69";
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("downArrow.png");
    img.setAttribute("style", "width: 10px; height: 7px; margin-left: 4px;");
    moreBtn.appendChild(img);
    moreBtn.setAttribute(
      "style",
      "cursor:pointer; background: #F9F5FF; border: none; color: #7F56D9; font-size: 12px; font-weight: 600; border-radius:9999px; padding: 4px 10px; margin-left: 8px; display: flex; align-items: center;"
    );

    const buttons = document.createElement("div");
    buttons.id = "vakyaCommentBtn69";
    buttons.className = "vakyaCommentBtn69";
    buttons.appendChild(agreeBtn);
    buttons.appendChild(disagreeBtn);
    buttons.appendChild(funnyBtn);
    buttons.appendChild(questionBtn);
    buttons.appendChild(supportBtn);
    // buttons.appendChild(regenerate);
    buttons.appendChild(moreBtn);

    buttons.setAttribute(
      "style",
      "display: flex; align-items: center; height: 100%; margin-top: 8px; position: relative;"
    );

    b.appendChild(buttons);
  });
};

export const EmbedEmptyMessageBtn = (isDarkMode: boolean) => {
  console.log("EmbedEmptyMessageBtn", isDarkMode);
  // Use Vakya for creating posts through AI
  const isButtonsEmbeded = document.getElementById("vakyaBtn69");
  if (isButtonsEmbeded) {
    return;
  }
  //   const toolbar = document.querySelector("[class");
  // select class share-creation-state__msg-wrapper
  const toolbar = document.getElementsByClassName(
    "share-creation-state__additional-toolbar"
  );

  const isBox = document.getElementsByClassName(
    "share-box"
  ) as HTMLCollectionOf<HTMLElement>;
  const url = chrome.runtime.getURL("icon.png");
  //check if display is none
  if (isBox.length > 0) {
    const NologinBtn = document.createElement("a");
    NologinBtn.href = "https://test.vakya.ai";
    NologinBtn.target = "_blank";
    NologinBtn.innerHTML =
      "<span style='color: #7F56D9; font-weight: 700; margin-right:3px'>Use Vakya </span> for creating posts through AI";
    NologinBtn.id = "NologinBtn69";
    NologinBtn.setAttribute(
      "style",
      `cursor: pointer; color: ${
        isDarkMode ? "#7F56D9" : "#7F56D9"
      }; background: transparent; padding: 4px 8px; font-size: 13px; font-size: 13px; width:303px ;display:flex;`
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

    toolbar[0].appendChild(buttons);
  }
};
