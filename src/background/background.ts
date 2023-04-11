import { SUCCESS_URL, UPWORK_ID } from "../contentScript/config";

chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled");
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage(() => {
    console.log("Options page opened");
  });
});

const HOST = "https://api.vakya.ai";

var contentTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
        if (data.headers.success !== "0") {
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
        sendResponse({ message: "fail", data: null });
      });

    return true;
  }

  if (request.type === "getPrompt" && request.promptData) {
    fetch(`${HOST}/api/v1/prompts/getPromptsStream`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.promptData),
    })
      .then((res) => res.body)
      .then((data) => {
        // console.log("data69", data);
        // sendResponse({ message: "success", data: data.body });
        // let newData = data.split("data: ").map((item) => item.trim());
        // newData = newData.filter((item) => item !== "");
        // console.log("newData", newData);
        // newData = newData.filter((item) => item !== "");

        // const dataObj = newData.map((item) => {
        //   return JSON.parse(item);
        // });
        // console.log("dataObj", dataObj);

        // console.log("newData", newData);
        const reader = data.getReader();
        // let charsReceived = 0;
        // reader.read().then(function processText({ done, value }) {
        //   // Result objects contain two properties:
        //   // done  - true if the stream has already given you all its data.
        //   // value - some data. Always undefined when done is true.
        //   if (done) {
        //     console.log("Stream complete");

        //     return;
        //   }

        //   // value for fetch streams is a Uint8Array
        //   charsReceived += value.length;
        //   const chunk = value;
        //   console.log("chunk", chunk);

        //   // Read some more, and call this function again
        //   return reader.read().then(processText);
        // });
        const decoder = new TextDecoder("utf-8");
        reader.read().then(function processText({ done, value }) {
          const chunk = decoder.decode(value);
          console.log("chunk", chunk);
          // const result = chunk.split("data: ").filter((item) => item !== "");
          // console.log("result", result);
          // const dataObj = result.map((item) => {
          //   return JSON.parse(item);
          // });
          // console.log("dataObj", dataObj);
        });
        // const decoder = new TextDecoder();
        // let done = false;
        // while (!done) {
        //   reader.read().then(({ value, done: doneReading }) => {
        //     done = doneReading;
        //     const chunkValue = decoder.decode(value);
        //     console.log("chunkValue", chunkValue);
        //   });
        // }
      })
      .catch((err) => {
        console.log("err69", err);
        sendResponse({ message: "error", data: [] });
      });

    return true;
  }

  // if (request.type === "getPrompt" && request.promptData) {
  //   fetch(`${HOST}/api/v1/prompts/getPromptsStream`, {
  //     method: "POST",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(request.promptData),
  //   })
  //     // .then((res) =>

  //     // )
  //     .then((data) => {
  //       console.log("data69", data);
  //       // if (data.headers.success) {
  //       //   sendResponse({ message: "success", data: data.body.choices });
  //       // } else {
  //       //   sendResponse({ message: "fail", data: [] });
  //       // }
  //     })
  //     .catch((err) => {
  //       console.log("err69", err);
  //       sendResponse({ message: "error", data: [] });
  //     });

  //   return true;
  // }

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

  if (
    request.type === "saveProfile" &&
    request.profileData
    // request.categoryID
  ) {
    var filldata = {};

    if (request?.default === true) {
      filldata = {
        toneDescription: request.profileData,
        categoryID: UPWORK_ID,
        default: 1,
      };
    } else {
      filldata = {
        toneDescription: request.profileData,
        categoryID: UPWORK_ID,
      };
    }

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

  if (request.type === "makeDefaultProfile" && request.profile) {
    const filldata = {
      categoryID: request.profile.categoryid,
      id: request.profile.id,
      default: 1,
    };
    fetch(`${HOST}/api/v1/user/updateUserCustomTones`, {
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
          });
        } else {
          sendResponse({
            message: "fail",
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        sendResponse({ message: "fail" });
      });
    return true;
  }

  if (request.type === "openOptionsPage") {
    chrome.runtime.openOptionsPage();
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const isTrue = changeInfo.url.includes("https://www.freelancer.com/");
    const checkUrl =
      changeInfo.url.split("/")[changeInfo.url.split("/").length - 1];
    if (checkUrl === "details" && isTrue) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["contentScript.js"],
      });
    }
  }
});
