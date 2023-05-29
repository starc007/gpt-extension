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
  // const dataTo = new DataTransfer();
  // dataTo.setData("text/plain", value);
  // input.innerText = value;
  // input.dispatchEvent(
  //   new ClipboardEvent("paste", {
  //     dataType: "text/plain",
  //     data: value,
  //     bubbles: true,
  //     clipboardData: dataTo,
  //     cancelable: true,
  //   } as ClipboardEventInit)
  // );
  const textWrapper = input.querySelector('[data-text="true"]')?.parentElement;
  if (textWrapper) {
    textWrapper.innerHTML = `<span data-text="true">${value}</span>`;
    textWrapper.dispatchEvent(
      new Event("input", { bubbles: true, cancelable: true })
    );
  }
};

export const findClosestInput: (el: Element) => HTMLInputElement | null = (
  el
) => {
  const inputEl = el.querySelector(
    'div[data-testid^="tweetTextarea_"][role="textbox"]'
  ) as HTMLInputElement;
  if (inputEl) {
    return inputEl;
  }

  if (!el.parentElement) {
    return null;
  } else {
    return findClosestInput(el.parentElement);
  }
};

async function sendServerRequest(
  toneId: string,
  prompt: string,
  txt: string,
  ele: any
) {
  // const twitterTextArea = document.querySelector(
  //   '[data-testid="tweetTextarea_0"]'
  // ) as any;
  chrome.storage.sync.set({
    oldTwittePrompt: txt,
  });

  // const toolbar = document.querySelector('[data-testid="toolBar"]');
  // const twitterTextArea = findClosestInput(toolbar);

  // let promptToSend = ""
  // let text = twitterTextArea.innerText;
  // const respText = await chrome.storage.sync.get("twitterRes");
  // const oldPrompt = await chrome.storage.sync.get("twittePrompt");
  // if (respText?.twitterRes && text === respText.twitterRes) {
  //   promptToSend = oldPrompt.twittePrompt;
  // } else {
  //   promptToSend = text;
  // }
  // remove space new line and other special characters from text
  // text = text.replace(/(\r\n|\n|\r)/gm, "");
  // text = text.replace(/(\s\s)/gm, " ");
  // text = text.trim();

  const isTweet = document.querySelector(
    '[data-testid="tweetButtonInline"]'
  ).textContent;

  const PromptData = {
    prompt: {
      description: isTweet === "Reply" ? prompt : txt,
    },
    toneId: toneId,
    maxTokens: 100,
    numResponses: 1,
    categoryInfoId: PLATFORMS.TWITTER,
    meta: {
      source: PLATFORMS.TWITTER,
      description:
        isTweet === "Reply" ? "replied to a tweet" : "Created post on twitter",
    },
  };

  addLoading(isLinkedIn);
  // const loremI =
  //   "loremsdfdsfds j djahdjs dakhdsk sahdsdhsakd hsakjhdjkd ajd hsjkdh ajkdsdhakjdhsjkd aj dhksjhjadjk dks hdjkahdksh dkhjas dkja dkja";
  // updateInput(twitterTextArea, loremI);
  chrome.runtime.sendMessage(
    { type: "getPrompt", promptData: PromptData },
    async (response) => {
      if (response?.data?.length) {
        const resText = response.data[0];
        const ptag = document.getElementById("failed69");
        if (ptag.style.display === "block") ptag.style.display = "none";
        await chrome.storage.sync.set({ twitterRes: resText });
        updateInput(ele, resText);
        removeLoading(isLinkedIn);
      } else {
        removeLoading(isLinkedIn);
        const ptag = document.getElementById("failed69");
        ptag.style.display = "block";
      }
    }
  );
}

export const EmbedTwitterButtons = () => {
  const toolbar = document.querySelector('[data-testid="toolBar"]');
  const parent = toolbar?.parentElement;
  const childCount = parent?.childElementCount;

  const isButtonsEmbeded = document.getElementById("vakyaBtn69");
  if (isButtonsEmbeded && childCount >= 2) {
    return;
  }

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

  funnyBtn.addEventListener("click", async () => {
    const text = findCurrentTweetText();
    const toolbar = document.querySelector('[data-testid="toolBar"]');
    const twitterTextArea = findClosestInput(toolbar);

    let promptToSend = "";
    let text1 = twitterTextArea.innerText;
    const respText = await chrome.storage.sync.get("twitterRes");
    const oldPrompt = await chrome.storage.sync.get("oldTwittePrompt");
    if (respText?.twitterRes && text1 === respText.twitterRes) {
      promptToSend = oldPrompt.oldTwittePrompt;
    } else {
      promptToSend = text1;
    }
    sendServerRequest(TONE_IDS.FUNNY, text, promptToSend, twitterTextArea);
  });

  const interestingBtn = document.createElement("div");
  interestingBtn.innerHTML = "😲 Interesting";
  interestingBtn.id = "interestingBtn69";
  interestingBtn.setAttribute(
    "style",
    "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; font-weight: 700; border-radius: 9999px; padding: 3px 8px; font-size: 12px; margin-left: 8px;"
  );

  interestingBtn.addEventListener("click", async () => {
    const text = findCurrentTweetText();
    const toolbar = document.querySelector('[data-testid="toolBar"]');
    const twitterTextArea = findClosestInput(toolbar);

    let promptToSend = "";
    let text1 = twitterTextArea.innerText;
    const respText = await chrome.storage.sync.get("twitterRes");
    const oldPrompt = await chrome.storage.sync.get("oldTwittePrompt");
    if (respText?.twitterRes && text1 === respText.twitterRes) {
      promptToSend = oldPrompt.oldTwittePrompt;
    } else {
      promptToSend = text1;
    }
    sendServerRequest(
      TONE_IDS.INTERESTING,
      text,
      promptToSend,
      twitterTextArea
    );
  });

  const qaBtn = document.createElement("div");
  qaBtn.innerHTML = "🤓 Q/A";
  qaBtn.id = "qaBtn69";
  qaBtn.setAttribute(
    "style",
    "cursor: pointer; color: #7F56D9; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 3px 8px; font-size: 12px; font-weight: 700;  margin-left: 8px;"
  );

  qaBtn.addEventListener("click", async () => {
    const text = findCurrentTweetText();
    const toolbar = document.querySelector('[data-testid="toolBar"]');
    const twitterTextArea = findClosestInput(toolbar);

    let promptToSend = "";
    let text1 = twitterTextArea.innerText;
    const respText = await chrome.storage.sync.get("twitterRes");
    const oldPrompt = await chrome.storage.sync.get("oldTwittePrompt");
    if (respText?.twitterRes && text1 === respText.twitterRes) {
      promptToSend = oldPrompt.oldTwittePrompt;
    } else {
      promptToSend = text1;
    }
    sendServerRequest(TONE_IDS.QUESTION, text, promptToSend, twitterTextArea);
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

  const p = document.createElement("p");
  p.innerHTML = "Failed";
  p.id = "failed69";
  p.setAttribute(
    "style",
    "color: red; font-size: 12px; font-weight: 600; margin-left: 8px; display: none;"
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
  buttons.appendChild(moreBtn);
  buttons.appendChild(p);

  toolbar.firstElementChild.setAttribute("style", "margin-top: 9px;");
  toolbar.lastElementChild.setAttribute("style", "margin-top: 9px;");
  toolbar.parentNode.prepend(buttons);
};
