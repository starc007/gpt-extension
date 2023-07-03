import { addLoading, removeLoading } from "../common";
import { MAX_WORDS, PLATFORMS, TONE_IDS } from "../config";

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
export const getTweetText = () => {
  const replyToTweet = document.querySelector(
    'article[data-testid="tweet"][tabindex="-1"]'
  );
  let replyTo: string | undefined = undefined;
  if (!!replyToTweet) {
    const textEl = replyToTweet.querySelector('div[data-testid="tweetText"]');
    if (!textEl || !textEl.textContent) {
      return;
    }

    replyTo = textEl.textContent;
  }
  return replyTo;
};

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
  ele: any,
  profileId?: string,
  twitterAditionalInfo?: string
) {
  // const loremI =
  //   "loremsdfdsfds j djahdjs dakhdsk sahdsdhsakd hsakjhdjkd ajd hsjkdh ajkdsdhakjdhsjkd aj dhksjhjadjk dks hdjkahdksh dkhjas dkja dkja";
  // updateInput(ele, loremI);
  // return;
  // const twitterTextArea = document.querySelector(
  //   '[data-testid="tweetTextarea_0"]'
  // ) as any;
  chrome.storage.sync.set({
    oldTwittePrompt: txt,
    oldTwitterToneId: toneId,
  });

  // chrome.storage.sync.set({ twitterRes: loremI });
  // return;

  const regenerateBtn69 = document.getElementById("regenerateBtn69");
  const isTweet =
    document.querySelector('[data-testid="tweetButtonInline"]').textContent ||
    document.querySelector('[data-testid="tweetButton"]').textContent;

  let PromptData = {};
  if (toneId !== null || toneId) {
    PromptData = {
      prompt: {
        description: prompt ? prompt : txt,
      },
      toneId: toneId,
      maxTokens: MAX_WORDS.TWITTER,
      numResponses: 1,
      categoryInfoId: PLATFORMS.TWITTER,
      meta: {
        source: prompt ? PLATFORMS.LINKEDIN_COMMENT : PLATFORMS.TWITTER,
        description: prompt ? "replied to a tweet" : "Created post on twitter",
      },
    };
  }
  if (toneId === null || !toneId) {
    PromptData = {
      prompt: {
        description: prompt ? prompt : txt,
      },
      toneId: "",
      maxTokens: MAX_WORDS.TWITTER,
      numResponses: 1,
      categoryInfoId: PLATFORMS.TWITTER,
      customToneId: profileId,
      meta: {
        source: prompt ? PLATFORMS.LINKEDIN_COMMENT : PLATFORMS.TWITTER,
        description: prompt ? "replied to a tweet" : "Created post on twitter",
      },
    };
  }

  if (profileId === null || !profileId) {
    PromptData = {
      prompt: {
        description: prompt ? prompt : txt,
      },
      toneId: toneId,
      maxTokens: MAX_WORDS.TWITTER,
      numResponses: 1,
      categoryInfoId: PLATFORMS.TWITTER,
      additionalInfo: twitterAditionalInfo,
      meta: {
        source: prompt ? PLATFORMS.LINKEDIN_COMMENT : PLATFORMS.TWITTER,
        description: prompt ? "replied to a tweet" : "Created post on twitter",
      },
    };
  }
  addLoading(isLinkedIn);
  const spinerId = document.getElementById("spinner69");
  spinerId.style.display = "block";

  chrome.runtime.sendMessage(
    { type: "getPrompt", promptData: PromptData },
    (response) => {
      if (response?.data?.length) {
        const resText = response.data[0] || "";
        const ptag = document.getElementById("failed69");
        if (ptag.style.display === "block") ptag.style.display = "none";
        const resp = resText
          .trim()
          .replace(/^\"/g, "")
          .replace(/\"$/g, "")
          .trim();

        updateInput(ele, resp);
        removeLoading(isLinkedIn);
        regenerateBtn69.style.display = "flex";
        chrome.storage.sync.set({ twitterRes: resp });
        spinerId.style.display = "none";
      } else {
        removeLoading(isLinkedIn);
        spinerId.style.display = "none";
        const ptag = document.getElementById("failed69");
        ptag.style.display = "block";
        regenerateBtn69.style.display = "none";
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
    // const text = findCurrentTweetText();
    const text = getTweetText();
    console.log("text", text);
    const toolbar = document.querySelector('[data-testid="toolBar"]');
    const twitterTextArea = findClosestInput(toolbar);

    let promptToSend = "";
    let text1 = twitterTextArea.innerText;
    let txt = text1.trim().replace(/^\"/g, "").replace(/\"$/g, "").trim();
    //check hashtag
    txt = txt?.includes("#") ? txt?.replace(/#\S+/g, "") : txt;
    const respText = await chrome.storage.sync.get("twitterRes");
    const oldPrompt = await chrome.storage.sync.get("oldTwittePrompt");
    const twitterResText = respText?.twitterRes
      ?.trim()
      .replace(/^\"/g, "")
      .replace(/\"$/g, "")
      .trim();

    if (txt?.toString() == twitterResText?.toString()) {
      promptToSend = oldPrompt.oldTwittePrompt;
    } else {
      promptToSend = txt;
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
    // const text = findCurrentTweetText();
    const text = getTweetText();
    const toolbar = document.querySelector('[data-testid="toolBar"]');
    const twitterTextArea = findClosestInput(toolbar);

    let promptToSend = "";
    let text1 = twitterTextArea.innerText;
    let txt = text1.trim().replace(/^\"/g, "").replace(/\"$/g, "").trim();
    txt = txt?.includes("#") ? txt?.replace(/#\S+/g, "") : txt;
    const respText = await chrome.storage.sync.get("twitterRes");
    const oldPrompt = await chrome.storage.sync.get("oldTwittePrompt");

    const twitterResText = respText?.twitterRes
      ?.trim()
      .replace(/^\"/g, "")
      .replace(/\"$/g, "")
      .trim();

    if (respText?.twitterRes && txt?.toString() == twitterResText?.toString()) {
      promptToSend = oldPrompt.oldTwittePrompt;
    } else {
      promptToSend = txt;
    }
    console.log("prompt int", promptToSend);
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
    const text = getTweetText();
    const toolbar = document.querySelector('[data-testid="toolBar"]');
    const twitterTextArea = findClosestInput(toolbar);

    let promptToSend = "";
    let text1 = twitterTextArea.innerText;
    let txt = text1.trim().replace(/^\"/g, "").replace(/\"$/g, "").trim();
    txt = txt?.includes("#") ? txt?.replace(/#\S+/g, "") : txt;
    const respText = await chrome.storage.sync.get("twitterRes");
    const oldPrompt = await chrome.storage.sync.get("oldTwittePrompt");
    const twitterResText = respText?.twitterRes
      ?.trim()
      .replace(/^\"/g, "")
      .replace(/\"$/g, "")
      .trim();
    if (
      respText?.twitterRes &&
      txt?.toString() === twitterResText?.toString()
    ) {
      promptToSend = oldPrompt.oldTwittePrompt;
    } else {
      promptToSend = txt;
    }
    sendServerRequest(TONE_IDS.QUESTION, text, promptToSend, twitterTextArea);
  });

  const regenerate = document.createElement("div");
  regenerate.id = "regenerateBtn69";
  const img1 = document.createElement("img");
  img1.src = chrome.runtime.getURL("generatePrimary.png");
  img1.setAttribute("style", "width: 17px; height: 17px;");
  regenerate.appendChild(img1);
  regenerate.setAttribute(
    "style",
    "cursor: pointer; border: 1px solid #7F56D9; background: transparent; border-radius: 9999px; padding: 4px 2px;  margin-left: 8px; width: 32px;justify-content: center; display: none;"
  );

  regenerate.addEventListener("click", async () => {
    const text = getTweetText();
    const toolbar = document.querySelector('[data-testid="toolBar"]');
    const twitterTextArea = findClosestInput(toolbar);

    let promptToSend = "";
    let text1 = twitterTextArea.innerText;
    let txt = text1.trim().replace(/^\"/g, "").replace(/\"$/g, "").trim();
    txt = txt?.includes("#") ? txt?.replace(/#\S+/g, "") : txt;
    const respText = await chrome.storage.sync.get("twitterRes");
    const oldPrompt = await chrome.storage.sync.get("oldTwittePrompt");
    const oldTonId = await chrome.storage.sync.get("oldTwitterToneId");
    const profileId = await chrome.storage.sync.get("twitterProfileId");
    const twitterAditionalInfo = await chrome.storage.sync.get(
      "twitterAditionalInfo"
    );
    const twitterResText = respText?.twitterRes
      ?.trim()
      .replace(/^\"/g, "")
      .replace(/\"$/g, "")
      .trim();
    if (
      respText?.twitterRes &&
      txt?.toString() === twitterResText?.toString()
    ) {
      promptToSend = oldPrompt.oldTwittePrompt;
    } else {
      promptToSend = txt;
    }
    sendServerRequest(
      oldTonId.oldTwitterToneId,
      text,
      promptToSend,
      twitterTextArea,
      profileId.twitterProfileId,
      twitterAditionalInfo.twitterAditionalInfo
    );
  });

  const moreBtn = document.createElement("div");
  moreBtn.innerHTML = "More";
  moreBtn.id = "moreBtn69";
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("downArrow.png");
  img.setAttribute("style", "width: 10px; height: 7px; margin-left: 4px;");
  img.id = "moreBtnImg69";
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
    const currentTweetText = getTweetText();

    text = text.replace(/(\r\n|\n|\r)/gm, "");
    text = text.replace(/(\s\s)/gm, " ");
    text = text.trim();
    // text = text?.replace(/#\S+/g, "");
    text = text?.includes("#") ? text?.replace(/#\S+/g, "") : text;
    const pmpt = text.length > 0 ? text : currentTweetText;
    chrome.storage.sync.set({ twitterPrompt: pmpt });

    //dropdown
    const commentEl = document.querySelectorAll('[data-testid="cellInnerDiv"]');
    const containerId = document.getElementById("containerVakya69");
    if (containerId) {
      const display = containerId.style.display;
      if (display === "none") {
        const bodyRect = document?.body?.getBoundingClientRect();
        const elemRect = moreBtn?.getBoundingClientRect();

        const top = elemRect.top - bodyRect.top;
        const left = elemRect.left - bodyRect.left + 65;

        containerId.style.top = `${top}px`;
        containerId.style.left = `${left}px`;
        containerId.style.display = "block";

        // commentEl?.forEach((el: HTMLDivElement, i) => {
        //   if (i == 0 || i == 1) return;
        //   el?.style.setProperty("z-index", "-1", "important");
        // });
      } else {
        console.log("inside else");
        containerId.style.display = "none";
        // commentEl?.forEach((el: HTMLDivElement, i) => {
        //   if (i == 0 || i == 1) return;
        //   el?.style.setProperty("z-index", "1", "important");
        // });
      }
    }
  });

  const spinner = document.createElement("img");

  spinner.src = chrome.runtime.getURL("spinner.gif");
  spinner.setAttribute(
    "style",
    "width: 40px; height: 40px; margin-left: 1px; display: none;"
  );
  spinner.id = "spinner69";

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
  buttons.appendChild(regenerate);
  buttons.appendChild(moreBtn);
  buttons.appendChild(spinner);
  buttons.appendChild(p);

  toolbar.firstElementChild.setAttribute("style", "margin-top: 9px;");
  toolbar.lastElementChild.setAttribute("style", "margin-top: 9px;");
  toolbar.parentNode.prepend(buttons);
  (toolbar as HTMLDivElement).click();
};
