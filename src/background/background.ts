chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled");
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage(() => {
    console.log("Options page opened");
  });
});

const HOST = "https://api.vakya.ai";
const UPWORK_ID = 1;
const SUCCESS_URL = [
  "https://api.vakya.ai/api/v1/login/success",
  "http://api.vakya.ai/api/v1/login/success",
];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "googleLogin") {
    chrome.windows.create(
      {
        url: `${HOST}/api/v1/login/google`,
        type: "popup",
        focused: true,
        width: 500,
        height: 500,
      },
      (window) => {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
          if (
            changeInfo.url === SUCCESS_URL[0] ||
            changeInfo.url === SUCCESS_URL[1]
          ) {
            chrome.windows.remove(window.id);
            chrome.tabs.onUpdated.removeListener(() => {});
            chrome.tabs.query(
              { active: true, currentWindow: true },
              function (tabs) {
                chrome.tabs.reload(tabs[0].id);
              }
            );
            sendResponse({ message: "success" });
          }
        });
      }
    );

    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if (request.type === "getUser") {
  //   fetch(`${HOST}/api/v1/login/success`, {
  //     method: "GET",
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("user", data);
  //       sendResponse({ message: "success", data: data });
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //       sendResponse({ message: "error", data: err });
  //     });

  //   return true;
  // }

  if (request.type === "getPrompt" && request.promptData) {
    fetch(`${HOST}/api/v1/prompts/getPrompts`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.promptData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.headers.success) {
          sendResponse({ message: "success", data: data.body.choices });
        } else {
          sendResponse({ message: "fail", data: [] });
        }
      })
      .catch((err) => {
        console.log("err", err);
        sendResponse({ message: "error", data: [] });
      });

    return true;
  }

  if (request.type === "fetchProfiles") {
    fetch(`${HOST}/api/v1/user/getUserCustomTones?categoryID=${UPWORK_ID}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.headers.success) {
          sendResponse({
            message: "success",
            profiles: data.body,
          });
        } else {
          sendResponse({
            message: "fail",
            profiles: [],
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        sendResponse({ message: "error", profiles: [] });
      });
    return true;
  }
});
