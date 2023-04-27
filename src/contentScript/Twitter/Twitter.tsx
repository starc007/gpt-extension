import React, { useEffect, useState, useRef } from "react";
import "../../assets/tailwind.css";

const Twitter = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const moreBtnId = document.getElementById("moreBtn69");
  useEffect(() => {
    moreBtnId?.addEventListener("mouseover", () => {
      setIsDropdownOpen(true);
    });
    const body = document.querySelector("body");
    body.addEventListener("mouseover", (e) => {
      if (
        !(e.target as HTMLElement).closest("#moreBtn69") &&
        !(e.target as HTMLElement).closest("#twitterVakya69")
      ) {
        setIsDropdownOpen(false);
      }
    });

    return () => {
      moreBtnId?.removeEventListener("mouseover", () => {});
    };
  }, []);

  useEffect(() => {
    const twitterTextArea = document.querySelector(
      '[data-testid="tweetTextarea_0"]'
    ) as HTMLTextAreaElement;
    twitterTextArea.click();
  }, []);

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
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
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
