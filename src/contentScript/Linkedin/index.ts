import { addLoading, removeLoading } from "../common";
import { MAX_WORDS, PLATFORMS, TONE_IDS } from "../config";

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

    moreBtn.addEventListener("click", () => {
      const containerId = document.getElementById("containerVakya69");
      if (containerId) {
        // check the display property to see
        const dis = containerId.style.display;
        if (dis === "none") {
          const bodyRect = document?.body?.getBoundingClientRect();
          const elemRect = moreBtn?.getBoundingClientRect();

          const top = elemRect.top - bodyRect.top;
          const left = elemRect.left - bodyRect.left + 65;

          containerId.style.top = `${top}px`;
          containerId.style.left = `${left}px`;
          containerId.style.display = "block";
        } else {
          containerId.style.display = "none";
        }
      }
    });

    const p = document.createElement("p");
    p.innerHTML = "Failed";
    p.id = "failedLink69";
    p.setAttribute(
      "style",
      "color: red; font-size: 12px; font-weight: 600; margin-left: 8px; display: none;"
    );

    const spinner = document.createElement("img");

    spinner.src = chrome.runtime.getURL("spinner.gif");
    spinner.setAttribute(
      "style",
      "width: 40px; height: 40px; margin-left: 1px; display: none;"
    );
    spinner.id = "spinner69";

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
    buttons.appendChild(spinner);
    buttons.appendChild(p);
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
    prompt: {
      description: text,
    },
    toneId: toneId,
    maxTokens: MAX_WORDS.LINKEDIN_COMMENT, ///linkedin comment word limit
    numResponses: 1,
    categoryInfoId: PLATFORMS.LINKEDIN,
    meta: {
      source: PLATFORMS.LINKEDIN_COMMENT,
      description: "replied to post",
    },
  };

  // var port = chrome.runtime.connect({ name: "vakya" });
  linkElem.textContent = "Writing......";
  // port.postMessage({ type: "getStreamPrompt", promptData: PromptData });
  addLoading(isLinkedIn);
  // port.onMessage.addListener((msg) => {
  //   if (msg.message === "done") {
  //     removeLoading(isLinkedIn);
  //     return;
  //   } else if (msg.message === "success") {
  //     const { data } = msg;
  //     let prevText = linkElem?.textContent;
  //     if (prevText === text) prevText = "";
  //     if (prevText?.includes("undefined")) {
  //       prevText = prevText?.replace("undefined", " ");
  //     }
  //     if (data?.includes("undefined")) {
  //       prevText = data?.replace("undefined", " ");
  //     }
  //     if (prevText === "Writing......") prevText = " ";
  //     let txt = prevText + data;
  //     txt = txt.replace("undefined", " ");
  //     txt = txt.replace(/^\s+|\s+$/g, "");
  //     linkElem.textContent = txt;
  //   }
  // });
  const spinerId = document.getElementById("spinner69");
  spinerId.style.display = "block";
  chrome.runtime.sendMessage(
    { type: "getPrompt", promptData: PromptData },
    (response) => {
      if (response?.data?.length) {
        const resText = response.data[0];
        let prevText = linkElem?.textContent;
        const ptag = document.getElementById("failedLink69");
        if (ptag?.style?.display === "block") ptag.style.display = "none";
        if (prevText === text) prevText = "";
        if (prevText === "Writing......") prevText = " ";
        if (prevText?.includes("undefined")) {
          prevText = prevText?.replace("undefined", " ");
        }
        if (resText?.includes("undefined")) {
          prevText = resText?.replace("undefined", " ");
        }
        let txt = prevText + resText;
        txt = txt.replace("undefined", " ");
        txt = txt.replace(/^\s+|\s+$/g, "");
        linkElem.textContent = txt;
        removeLoading(isLinkedIn);
        spinerId.style.display = "none";
      } else {
        spinerId.style.display = "none";
        removeLoading(isLinkedIn);
        linkElem.textContent = "";
        const ptag = document.getElementById("failedLink69");
        ptag.style.display = "block";
      }
    }
  );
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

    // const moreBtn = document.createElement("div");
    // moreBtn.innerHTML = "More";
    // moreBtn.id = "moreCommentBtn69";
    // const img = document.createElement("img");
    // img.src = chrome.runtime.getURL("downArrow.png");
    // img.setAttribute("style", "width: 10px; height: 7px; margin-left: 4px;");
    // moreBtn.appendChild(img);
    // moreBtn.setAttribute(
    //   "style",
    //   "cursor:pointer; background: #F9F5FF; border: none; color: #7F56D9; font-size: 12px; font-weight: 600; border-radius:9999px; padding: 4px 10px; margin-left: 8px; display: flex; align-items: center;"
    // );
    const spinner = document.createElement("img");

    spinner.src = chrome.runtime.getURL("spinner.gif");
    spinner.setAttribute(
      "style",
      "width: 40px; height: 40px; margin-left: 1px; display: none;"
    );
    spinner.id = "spinner69";

    const buttons = document.createElement("div");
    buttons.id = "vakyaCommentBtn69";
    buttons.className = "vakyaCommentBtn69";
    buttons.appendChild(agreeBtn);
    buttons.appendChild(disagreeBtn);
    buttons.appendChild(funnyBtn);
    buttons.appendChild(questionBtn);
    buttons.appendChild(supportBtn);
    buttons.appendChild(spinner);
    // buttons.appendChild(regenerate);
    // buttons.appendChild(moreBtn);

    buttons.setAttribute(
      "style",
      "display: flex; align-items: center; height: 100%; margin-top: 8px; position: relative;"
    );

    b.appendChild(buttons);
  });
};
