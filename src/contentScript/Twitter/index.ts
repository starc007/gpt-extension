import { PLATFORMS } from "../config";

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
    "cursor: pointer; color: #1d9bf0; border: 1px solid #1d9bf0; background: transparent; border-radius: 9999px; padding: 3px 8px; font-size: 12px; font-weight: 700"
  );

  const interestingBtn = document.createElement("div");
  interestingBtn.innerHTML = "😲 Interesting";
  interestingBtn.id = "interestingBtn69";
  interestingBtn.setAttribute(
    "style",
    "cursor: pointer; color: #1d9bf0; border: 1px solid #1d9bf0; background: transparent; font-weight: 700; border-radius: 9999px; padding: 3px 8px; font-size: 12px; margin-left: 8px;"
  );
  const qaBtn = document.createElement("div");
  qaBtn.innerHTML = "🤓 Q/A";
  qaBtn.id = "qaBtn69";
  qaBtn.setAttribute(
    "style",
    "cursor: pointer; color: #1d9bf0; border: 1px solid #1d9bf0; background: transparent; border-radius: 9999px; padding: 3px 8px; font-size: 12px; font-weight: 700;  margin-left: 8px;"
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
  buttons.appendChild(moreBtn);

  toolbar.firstElementChild.setAttribute("style", "margin-top: 9px;");
  toolbar.lastElementChild.setAttribute("style", "margin-top: 9px;");
  toolbar.parentNode.prepend(buttons);
};

// export const updateInput = (newText) => {
//   // if (linkedinElem) {
//   //   linkedinElem.innerHTML = "<p>" + newText + "</p>";
//   //   return;
//   // }

//   const input = document.querySelector('[data-testid="tweetTextarea_0"]');

//   const data = new DataTransfer();
//   data.setData("text/plain", newText);
//   input.dispatchEvent(
//     new ClipboardEvent("paste", {
//       dataType: "text/plain",
//       data: newText,
//       bubbles: true,
//       clipboardData: data,
//       cancelable: true,
//     })
//   );
// };
