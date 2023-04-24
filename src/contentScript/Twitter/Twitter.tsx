import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import "../../assets/tailwind.css";

const options = [
  {
    value: "1",
    label: "1",
  },
];

const Twitter = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const refFocus = useRef<HTMLInputElement>(null);

  const moreBtnId = document.getElementById("moreBtn69");
  useEffect(() => {
    // add mouseover event listener
    moreBtnId?.addEventListener("mouseover", () => {
      setIsDropdownOpen(true);
    });
    // add mouseout event listener
    // moreBtnId?.addEventListener("mouseout", () => {
    //   setIsDropdownOpen(false);
    // });

    // dropVakya69?.addEventListener("mouseover", () => {
    //   setIsDropdownOpen(true);
    // });

    // dropVakya69?.addEventListener("mouseout", () => {
    //   setIsDropdownOpen(false);
    // });

    const body = document.querySelector("body");

    // body.addEventListener("mouseover", (e) => {
    //   if (
    //     !(e.target as HTMLElement).closest("#moreBtn69") &&
    //     !(e.target as HTMLElement).closest("#twitterVakya69")
    //   ) {
    //     setIsDropdownOpen(false);
    //   }
    // });

    return () => {
      moreBtnId?.removeEventListener("mouseover", () => {});
      //   moreBtnId?.removeEventListener("mouseout", () => {});
      //   dropVakya69?.removeEventListener("mouseover", () => {});
    };
  }, []);

  //  data - focusvisible - polyfill;
  useEffect(() => {
    const twitterTextArea = document.querySelector(
      '[data-testid="tweetTextarea_0"]'
    );
    // const isFocus = twitterTextArea?.getAttribute("data-focusvisible-polyfill");
    if (isDropdownOpen) {
      //remove attribute
      twitterTextArea?.removeAttribute("data-focusvisible-polyfill");
      //   twitterTextArea?.setAttribute("data-focusvisible-polyfill", "false");
    }
  }, [isDropdownOpen]);

  const handleFocus = () => {
    const twitterTextArea = document.querySelector(
      '[data-testid="tweetTextarea_0"]'
    );
    twitterTextArea?.removeAttribute("data-focusvisible-polyfill");

    // make focus to input
    refFocus.current?.focus();
  };

  return isDropdownOpen ? (
    <div className="w-96 rounded-lg bg-dark flex flex-col space-y-6 p-4 border border-primary">
      <div className="flex items-start space-x-4">
        <img src={chrome.runtime.getURL("select.png")} className="w-5 h-4" />
        <div className="flex flex-col -mt-[2px]">
          <p className="font-medium text-white">Select Profile from Vakya</p>
          <p className="text-xs font-normal text-lightPurple2">
            Results will be generated based on your profile selection
          </p>
          <Select
            options={options}
            placeholder="Select Profile"
            // defaultValue={toneOptions[0]}
            className="w-full mt-3 z-20"
            // onChange={(e) => setFormData({ ...formData, toneId: e.value })}
            maxMenuHeight={150}
            styles={{
              control: (provided) => ({
                ...provided,
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                "&:focus": {
                  boxShadow: "none",
                  outline: "none",
                },
                "&:hover": {
                  border: "1px solid #e2e8f0",
                },
                height: "40px",
                fontSize: "14px",
                backgroundColor: "transparent",
              }),
              indicatorSeparator: (state) => ({
                display: "none",
              }),
            }}
            theme={(theme) => {
              return {
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#7F56D9",
                  primary25: "#ECE3FF",
                },
              };
            }}
          />
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
              ref={refFocus}
              onClick={handleFocus}
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
