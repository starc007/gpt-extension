chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled");
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage(() => {
    console.log("Options page opened");
  });
});

const HOST = "https://api.vakya.ai";
const SUCCESS_URL = [
  "https://api.vakya.ai/api/v1/login/success",
  "http://api.vakya.ai/api/v1/login/success",
];

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
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
            chrome.cookies.get(
              {
                url: "https://api.vakya.ai",
                name: "connect.sid",
              },
              (cookie) => {
                chrome.windows.remove(window.id);
                // remove listener
                chrome.tabs.onUpdated.removeListener(() => {});
                chrome.storage.sync.set({ cookie69: cookie }, () => {
                  console.log("%c hey bro", "color: green;");
                });
                chrome.cookies.set(
                  {
                    domain: cookie.domain,
                    expirationDate: cookie.expirationDate,
                    httpOnly: cookie.httpOnly,
                    name: cookie.name,
                    path: cookie.path,
                    sameSite: cookie.sameSite,
                    secure: cookie.secure,
                    storeId: cookie.storeId,
                    value: cookie.value,
                    url: "https://api.vakya.ai",
                  },

                  () => {
                    chrome.tabs.query(
                      { active: true, currentWindow: true },
                      function (tabs) {
                        chrome.tabs.reload(tabs[0].id);
                      }
                    );
                    sendResponse({ message: "success" });
                  }
                );
              }
            );
          }
        });
      }
    );
  }

  if (request.message === "setCookie") {
    console.log("setCookie");
    chrome.cookies.get(
      {
        url: "https://api.vakya.ai",
        name: "connect.sid",
      },
      (cookie) => {
        // set the cookie in options page and content script
        console.log("cookie", cookie);
        chrome.cookies.set(
          {
            domain: cookie.domain,
            expirationDate: cookie.expirationDate,
            httpOnly: cookie.httpOnly,
            name: cookie.name,
            path: cookie.path,
            sameSite: cookie.sameSite,
            secure: cookie.secure,
            storeId: cookie.storeId,
            value: cookie.value,
            url: "https://api.vakya.ai",
          },

          () => {
            sendResponse({ message: "success", cookie: cookie });
          }
        );
      }
    );
  }

  return true;
});
