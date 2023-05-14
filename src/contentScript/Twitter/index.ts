import { addLoading, removeLoading } from "../common";
import { PLATFORMS, TONE_IDS } from "../config";

function textNodesUnder(node) {
  var all = [];
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (node.nodeType == 3) all.push(node);
    else all = all.concat(textNodesUnder(node));
  }

  return all;
}

export function findCurrentTweetText() {
  let modalText = document.querySelector('[aria-labelledby="modal-header"]');
  modalText = modalText
    ? modalText.querySelector('[data-testid="tweetText"]') ||
      modalText.querySelector('[data-testid="tweet"]')
    : document.querySelector('[data-testid="tweetText"]');
  // const modalText = document.querySelector('[data-testid="tweetText"]');
  let textRaw = null;

  if (modalText) {
    textRaw = textNodesUnder(modalText);
  } else {
    //select twit text (there could be a lot of them if its a thread)
    const tweetTextNodeList = document.querySelectorAll(
      '[data-testid="tweetText"]'
    );
    // check if it's active tweet (node has font size 14px)
    const tweetTextNode = Array.from(tweetTextNodeList).filter((node) => {
      const styles = getComputedStyle(node);
      return parseInt(styles.fontSize) > 20;
    });

    if (tweetTextNode.length > 0) {
      textRaw = textNodesUnder(tweetTextNode[0]);
    }
  }
  // get text from text object
  const text = textRaw
    ? textRaw
        .map((node) => node.data)
        .join(" ")
        .trim()
    : "";

  return text;
}

let isLinkedIn = window.location.origin.includes("linkedin.com");

export const updateInput = (input: any, value: string) => {
  const dataTo = new DataTransfer();
  dataTo.setData("text/plain", value);
  input.dispatchEvent(
    new ClipboardEvent("paste", {
      clipboardData: dataTo,
      bubbles: true,
      cancelable: true,
    } as ClipboardEventInit)
  );
};

function sendServerRequest(toneId: string, prompt: string) {
  const twitterTextArea = document.querySelector(
    '[data-testid="tweetTextarea_0"]'
  ) as any;
  let text = twitterTextArea.innerText;
  // remove space new line and other special characters from text
  text = text.replace(/(\r\n|\n|\r)/gm, "");
  text = text.replace(/(\s\s)/gm, " ");
  text = text.trim();
  const PromptData = {
    prompt: {
      description: text.length > 0 ? text : prompt,
    },
    toneId: toneId,
    maxTokens: 100,
    numResponses: 1,
    categoryInfoId: PLATFORMS.TWITTER,
    meta: {
      source: PLATFORMS.TWITTER,
      description: prompt ? "replied to a tweet" : "Created post on twitter",
    },
  };

  // const txt =
  //   "loreum ipsum dolor sit amet djahd kjdhjs dkdh jksd kjad jdj hd dkh adsakdhds";

  // const dataTo = new DataTransfer();
  // dataTo.setData("text/plain", txt);
  // twitterTextArea.dispatchEvent(
  //   new ClipboardEvent("paste", {
  //     clipboardData: dataTo,
  //     bubbles: true,
  //     cancelable: true,
  //   } as ClipboardEventInit)
  // );
  // var port = chrome.runtime.connect({ name: "vakya" });
  // twitterTextArea.innerText = "Writing......";
  addLoading(isLinkedIn);
  // port.postMessage({ type: "getPrompt", promptData: PromptData });
  // port.onMessage.addListener((msg) => {
  //   if (msg.message === "done") {
  //     removeLoading(isLinkedIn);
  //     return;
  //   } else if (msg.message === "success") {
  //     const { data } = msg;
  //     let prevText = twitterTextArea.innerText;
  //     if (prevText?.includes("undefined")) {
  //       prevText = prevText?.replace("undefined", " ");
  //     }
  //     if (data?.includes("undefined")) {
  //       prevText = data?.replace("undefined", " ");
  //     }
  //     if (prevText === "Writing......") prevText = "";
  //     let txt = prevText + data;
  //     txt = txt.replace("undefined", " ");

  //     const dataTo = new DataTransfer();
  //     dataTo.setData("text/plain", txt);
  //     twitterTextArea.dispatchEvent(
  //       new ClipboardEvent("paste", {
  //         clipboardData: dataTo,
  //         bubbles: true,
  //         cancelable: true,
  //       } as ClipboardEventInit)
  //     );
  //   }
  // });
  // updateInput(twitterTextArea, "Writing......");
  chrome.runtime.sendMessage(
    { type: "getPrompt", promptData: PromptData },
    (response) => {
      if (response?.data?.length) {
        const resText = response.data[0];
        updateInput(twitterTextArea, resText);
        removeLoading(isLinkedIn);
      } else {
        removeLoading(isLinkedIn);
        updateInput(
          twitterTextArea,
          "Failed to generate text please try again"
        );
      }
    }
  );
}

export const EmbedTwitterButtons = () => {
  const isButtonsEmbeded = document.getElementById("vakyaBtn69");
  if (isButtonsEmbeded) {
    return;
  }

  const toolbar = document.querySelector('[data-testid="toolBar"]');

  if (!toolbar) {
    requestAnimationFrame(EmbedTwitterButtons);
    return;
  }

  const funnyBtn = document.createElement("div");
  funnyBtn.innerHTML = "😂 Funny";
  funnyBtn.id = "funnyBtn69";
  funnyBtn.setAttribute(
    "style",
    "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 3px 8px; font-size: 12px; font-weight: 700"
  );

  funnyBtn.addEventListener("click", () => {
    const text = findCurrentTweetText();
    sendServerRequest(TONE_IDS.FUNNY, text);
  });

  const interestingBtn = document.createElement("div");
  interestingBtn.innerHTML = "😲 Interesting";
  interestingBtn.id = "interestingBtn69";
  interestingBtn.setAttribute(
    "style",
    "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; font-weight: 700; border-radius: 9999px; padding: 3px 8px; font-size: 12px; margin-left: 8px;"
  );

  interestingBtn.addEventListener("click", () => {
    const text = findCurrentTweetText();
    sendServerRequest(TONE_IDS.INTERESTING, text);
  });

  const qaBtn = document.createElement("div");
  qaBtn.innerHTML = "🤓 Q/A";
  qaBtn.id = "qaBtn69";
  qaBtn.setAttribute(
    "style",
    "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 3px 8px; font-size: 12px; font-weight: 700;  margin-left: 8px;"
  );

  qaBtn.addEventListener("click", () => {
    const text = findCurrentTweetText();
    sendServerRequest(TONE_IDS.QUESTION, text);
  });

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
    const twitterTextArea = document.querySelector(
      '[data-testid="tweetTextarea_0"]'
    ) as any;
    let text = twitterTextArea.innerText;
    const currentTweetText = findCurrentTweetText();

    text = text.replace(/(\r\n|\n|\r)/gm, "");
    text = text.replace(/(\s\s)/gm, " ");
    text = text.trim();

    const pmpt = text.length > 0 ? text : currentTweetText;
    chrome.storage.sync.set({ twitterPrompt: pmpt });
  });

  const buttons = document.createElement("div");
  buttons.id = "vakyaBtn69";
  buttons.setAttribute(
    "style",
    "display: flex; align-items: center; height: 100%; margin-top: 8px; position: relative;"
  );

  buttons.appendChild(funnyBtn);
  buttons.appendChild(interestingBtn);
  buttons.appendChild(qaBtn);
  buttons.appendChild(moreBtn);

  toolbar.firstElementChild.setAttribute("style", "margin-top: 9px;");
  toolbar.lastElementChild.setAttribute("style", "margin-top: 9px;");
  toolbar.parentNode.prepend(buttons);
};
