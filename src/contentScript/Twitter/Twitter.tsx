import React, { useEffect, useState, useRef } from "react";
import "../../assets/tailwind.css";
import { useAuth } from "../../options/AuthContext";
import { PLATFORMS, TONE_IDS } from "../config";
import { findCurrentTweetText } from "./index";

const Twitter = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedin, profiles } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [allText, setAllText] = useState("");
  const [formData, setFormData] = useState({
    prompt: "",
    toneId: "",
    profileId: "",
    additionalInfo: "",
  });

  const moreBtnId = document.getElementById("moreBtn69");
  // const funnyBtn69 = document.getElementById("funnyBtn69");
  // const interestingBtn69 = document.getElementById("interestingBtn69");
  // const qaBtn69 = document.getElementById("qaBtn69");
  // const regenerateBtn69 = document.getElementById("regenerateBtn69");
  useEffect(() => {
    moreBtnId?.addEventListener("click", () => {
      setIsDropdownOpen(!isDropdownOpen);
    });
    // const body = document.querySelector("body");
    // body.addEventListener("mouseover", (e) => {
    //   if (
    //     !(e.target as HTMLElement).closest("#moreBtn69") &&
    //     !(e.target as HTMLElement).closest("#containerVakya69")
    //   ) {
    //     setIsDropdownOpen(false);
    //   }
    // });

    return () => {
      moreBtnId?.removeEventListener("mouseover", () => {});
    };
  }, [isDropdownOpen]);

  const twitterTextArea = document.querySelector(
    '[data-testid="tweetTextarea_0"]'
  ) as HTMLTextAreaElement;
  useEffect(() => {
    twitterTextArea.click();
  }, []);

  // const handleSubmit = (prompt: string, toneId: string) => {
  //   const text = twitterTextArea.innerText;
  //   console.log("text", text);

  //   const PromptData = {
  //     prompt: text ? text : prompt,
  //     toneId: toneId,
  //     maxTokens: 100,
  //     numResponses: 1,
  //     categoryInfoId: PLATFORMS.TWITTER,
  //     meta: {
  //       source: PLATFORMS.TWITTER,
  //       description: prompt ? "replied to a tweet" : "Created post on twitter",
  //     },
  //   };
  //   setIsGenerating(true);
  //   var port = chrome.runtime.connect({ name: "vakya" });
  //   // twitterTextArea.innerText = "Writing......";
  //   port.postMessage({ type: "getPrompt", promptData: PromptData });
  //   port.onMessage.addListener((msg) => {
  //     if (msg.message === "done") {
  //       setIsGenerating(false);
  //       return;
  //     } else if (msg.message === "success") {
  //       const { data } = msg;
  //       let prevText = twitterTextArea.innerText;
  //       if (prevText === allText) prevText = "";
  //       if (prevText?.includes("undefined")) {
  //         prevText = prevText?.replace("undefined", " ");
  //       }
  //       if (data?.includes("undefined")) {
  //         prevText = data?.replace("undefined", " ");
  //       }
  //       if (prevText === "Writing......") prevText = "";
  //       let txt = prevText + data;
  //       txt = txt.replace("undefined", " ");

  //       // twitterTextArea.innerText = txt;
  //       //add text to the text area
  //       // twitterTextArea.value = txt;
  //       // twitterTextArea.innerText = txt;
  //       // twitterTextArea.dispatchEvent(new Event("input", { bubbles: true }));
  //       const input = document.querySelector('[data-testid="tweetTextarea_0"]');
  //       const dataTo = new DataTransfer();
  //       dataTo.setData("text/plain", txt);
  //       input.dispatchEvent(
  //         new ClipboardEvent("paste", {
  //           clipboardData: dataTo,
  //           bubbles: true,
  //           cancelable: true,
  //         } as ClipboardEventInit)
  //       );

  //       setAllText(txt);
  //     }
  //   });
  // };

  useEffect(() => {
    // if (isLoggedin) {
    //   funnyBtn69?.addEventListener("click", () => {
    //     const text = findCurrentTweetText();
    //     handleSubmit(text, TONE_IDS.FUNNY);
    //   });
    //   interestingBtn69?.addEventListener("click", () => {
    //     const text = findCurrentTweetText();
    //     handleSubmit(text, TONE_IDS.INTERESTING);
    //   });
    //   qaBtn69?.addEventListener("click", () => {
    //     const text = findCurrentTweetText();
    //     handleSubmit(text, TONE_IDS.QUESTION);
    //   });
    //   regenerateBtn69?.addEventListener("click", () => {
    //     handleSubmit(formData.prompt, formData.toneId);
    //   });
    // }
  }, [isLoggedin, formData]);

  return isDropdownOpen ? (
    <div className="w-96 rounded-lg bg-dark flex flex-col space-y-6 p-4 z-50 border border-primary">
      <div className="flex items-start space-x-4">
        <img src={chrome.runtime.getURL("select.png")} className="w-5 h-4" />
        <div className="flex flex-col -mt-[2px]">
          <p className="font-medium text-white">Select Profile from Vakya</p>
          <p className="text-xs font-normal text-lightPurple2">
            Results will be generated based on your profile selection
          </p>
          <select className="w-full mt-3 px-4 h-11 bg-transparent border border-white rounded-lg text-white">
            <option value="0">Select Profile</option>
            {profiles?.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile?.toneDescription?.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <img src={chrome.runtime.getURL("userplus.png")} className="w-6" />
        <div className="flex flex-col -mt-[2px]">
          <p className="font-medium text-white">Create New Profile</p>
          <p className="text-xs font-normal text-lightPurple2">
            Create profile the way you want vakya to answer for you
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <img src={chrome.runtime.getURL("usercheck.png")} className="w-6" />
        <div className="flex flex-col -mt-[2px]">
          <p className="font-medium text-white">Write as</p>
          <p className="text-xs font-normal text-lightPurple2">
            Write description of a persona (person or specific personality) you
            want vakya to generate results as.
          </p>
          <div className="border flex justify-between items-center rounded-lg mt-4 py-1 w-full">
            <input
              type="text"
              className="w-max h-10 px-2 text-sm text-white bg-transparent border-none focus:outline-none"
              placeholder="Write as"
            />
            <button className="w-20 h-10 mr-1 text-sm text-white bg-primary rounded-lg border-none focus:outline-none">
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Twitter;
