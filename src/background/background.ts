chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled");
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "popup.html" });
});

// async function getJobDescriptionOfUpwork() {
//   const desc = document.getElementById("up-truncation-1");
//   if (desc) {
//     // console.log(desc.innerText);
//     return desc.innerText;
//   }
// }

// chrome.action.onClicked.addListener(function (tab) {
//   chrome.tabs.executeScript({
//     file: "insert.js",
//   });
// });

// run content script when page is loaded and ready
