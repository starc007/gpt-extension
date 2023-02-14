chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled");
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage(() => {
    console.log("Options page opened");
  });
});

const HOST = "http://vakya.ai";
const SUCCESS_URL = [
  "https://vakya.ai/api/v1/login/success",
  "http://vakya.ai/api/v1/login/success",
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
        console.log("coming from content2.....", window);
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
          console.log(changeInfo.url);
          if (
            changeInfo.url === SUCCESS_URL[0] ||
            changeInfo.url === SUCCESS_URL[1]
          ) {
            chrome.cookies.get(
              {
                url: "http://vakya.ai",
                name: "connect.sid",
              },
              (cookie) => {
                console.log(cookie);
                chrome.windows.remove(window.id);
                // remove listener
                chrome.tabs.onUpdated.removeListener(() => {});
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
                    url: "http://vakya.ai",
                  },

                  () => {
                    console.log("cookie set");
                    fetch("http://vakya.ai/api/v1/login/success", {
                      method: "GET",
                      credentials: "include",
                    })
                      .then((res) => res.json())
                      .then((res) => {
                        console.log("res", res);
                      });

                    // sendResponse({ message: "success" });
                  }
                );
              }
            );
          }
        });
      }
    );
  }
  return true;
});
