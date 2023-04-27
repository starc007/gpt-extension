import React, { useEffect, useState } from "react";
import "../../assets/tailwind.css";
import { useAuth } from "../../options/AuthContext";
import { PLATFORMS, TONE_IDS } from "../config";

const Linkedin = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedin, profiles } = useAuth();
  const [formData, setFormData] = useState({
    prompt: "",
    toneId: "",
    categoryInfoId: "",
    customToneId: "",
  });

  const moreBtnId = document.getElementById("moreBtn69");
  const funnyBtn69 = document.getElementById("funnyBtn69");

  useEffect(() => {
    moreBtnId?.addEventListener("mouseover", () => {
      setIsDropdownOpen(true);
    });

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
    };
  }, []);
  const qlEditor = document?.querySelector(".ql-editor");
  const handleSubmit = (prompt: string, toneId: string) => {
    const PromptData = {
      prompt: prompt,
      toneId: toneId,
      maxTokens: 100,
      numResponses: 1,
      categoryInfoId: PLATFORMS.LINKEDIN,
      meta: {
        source: PLATFORMS.LINKEDIN,
        description: "Created post on linkedin",
      },
    };

    var port = chrome.runtime.connect({ name: "vakya" });
    port.postMessage({ type: "getPrompt", promptData: PromptData });
    port.onMessage.addListener((msg) => {
      if (msg.data) {
        console.log("msg.data", msg.data);
        // if (msg.message === "done") {
      }
    });
  };

  useEffect(() => {
    if (isLoggedin) {
      funnyBtn69.addEventListener("click", () => {
        const qlEditorValue = qlEditor?.textContent;
        console.log("funnyBtn69 clicked");
        // console.log("qlEditorValue", qlEditorValue);
        handleSubmit(qlEditorValue, TONE_IDS.FUNNY);
      });
    }
  }, [isLoggedin]);

  if (!isLoggedin) return null;

  // get the value of ql editor

  return isDropdownOpen ? (
    <div className="w-[30rem] rounded-lg bg-dark flex flex-col space-y-6 p-4 border border-primary">
      <div className="flex items-start space-x-4">
        <img src={chrome.runtime.getURL("select.png")} className="w-6" />
        <div className="flex flex-col -mt-[2px]">
          <p
            className="font-medium text-white"
            style={{
              fontSize: "14px",
            }}
          >
            Select Profile from Vakya
          </p>
          <p
            className="font-normal text-lightPurple2"
            style={{
              fontSize: "10px",
            }}
          >
            Results will be generated based on your profile selection
          </p>
          <select className="selectLinkedin69">
            {profiles?.map((profile) => (
              <option value={profile._id}>
                {profile?.toneDescription?.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <img src={chrome.runtime.getURL("userplus.png")} className="w-6" />
        <div className="flex flex-col -mt-[2px]">
          <p
            className="font-medium text-white"
            style={{
              fontSize: "14px",
            }}
          >
            Create New Profile
          </p>
          <p
            className="font-normal text-lightPurple2"
            style={{
              fontSize: "10px",
            }}
          >
            Create profile the way you want vakya to answer for you
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <img src={chrome.runtime.getURL("usercheck.png")} className="w-6" />
        <div className="flex flex-col -mt-[2px]">
          <p
            className="font-medium text-white"
            style={{
              fontSize: "14px",
            }}
          >
            Write as
          </p>
          <p
            className="font-normal text-lightPurple2"
            style={{
              fontSize: "10px",
            }}
          >
            Write description of a persona (person or specific personality) you
            want vakya to generate results as.
          </p>
          <div className="divLinkedin__moreBtn69">
            <input type="text" placeholder="Write as" />
            <button>Generate</button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Linkedin;
