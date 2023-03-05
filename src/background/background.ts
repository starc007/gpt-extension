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

var contentTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // get the current tab url
  // if (request.type === "getTabUrl") {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     console.log("tabs", tabs);
  //   });
  //   return true;
  // }

  if (request.message === "googleLogin") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      contentTabId = tabs[0].id;
    });
    chrome.tabs.create(
      {
        url: `${HOST}/api/v1/login/google`,
        active: true,
      },
      (tab) => {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
          if (
            changeInfo.url === SUCCESS_URL[0] ||
            changeInfo.url === SUCCESS_URL[1]
          ) {
            chrome.storage.sync.set({ isLoggedin: true });
            chrome.tabs.remove(tab.id);
            chrome.tabs.onUpdated.removeListener(() => {});
            if (request.type.isContentScript) {
              // redirect to contentTabId
              chrome.tabs.update(contentTabId, { active: true });
            } else {
              chrome.runtime.openOptionsPage();
            }
            sendResponse({ message: "success" });
          }
          if (
            changeInfo.url !== SUCCESS_URL[0] ||
            changeInfo.url !== SUCCESS_URL[1]
          ) {
            chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
              if (tabId === tab.id) {
                sendResponse({ message: "fail" });
                chrome.tabs.onRemoved.removeListener(() => {});
              }
            });
          }
        });
      }
    );

    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getUser") {
    fetch(`${HOST}/api/v1/login/success`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.headers.success) {
          const user = {
            name: data?.body?.body?.displayName,
            email: data?.body?.body?.email,
            userId: data?.body?.userId,
            picture: data?.body?.body?.picture,
          };
          sendResponse({ message: "success", data: user });
        } else {
          sendResponse({ message: "fail", data: null });
        }
      })
      .catch((err) => {
        console.log("err", err);
        sendResponse({ message: "error", data: null });
      });

    return true;
  }

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

  if (request.type === "saveProfile" && request.profileData) {
    const filldata = {
      toneDescription: request.profileData,
      categoryID: UPWORK_ID,
    };
    fetch(`${HOST}/api/v1/user/createUserCustomeTones`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filldata),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.headers.success) {
          sendResponse({
            message: "success",
            data: data.body,
          });
        } else {
          sendResponse({
            message: "fail",
            data: [],
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        sendResponse({ message: "error", data: [] });
      });
    return true;
  }

  if (request.type === "openOptionsPage") {
    chrome.runtime.openOptionsPage();
    return true;
  }
});
