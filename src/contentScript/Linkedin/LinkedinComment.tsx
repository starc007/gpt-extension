import React, { useEffect, useState } from "react";
import "../../assets/tailwind.css";
import { useAuth } from "../../options/AuthContext";
import { PLATFORMS, TONE_IDS } from "../config";
import { toast } from "react-hot-toast";

const LinkedinComment = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedin, profiles } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const moreBtnId = document.getElementById("moreCommentBtn69");

  useEffect(() => {
    moreBtnId?.addEventListener("click", () => {
      console.log("clicked comment", isDropdownOpen);
      setIsDropdownOpen(!isDropdownOpen);
    });

    return () => {
      moreBtnId?.removeEventListener("click", () => {});
    };
  }, [isDropdownOpen]);
  const qlEditor = document?.querySelector(".ql-editor");

  if (!isLoggedin) return null;

  const handleSubmitProfile = (profileId: string) => {
    const PromptData = {
      prompt: prompt,
      toneId: "",
      maxTokens: 100,
      numResponses: 1,
      customToneId: profileId,
      categoryInfoId: PLATFORMS.LINKEDIN,
      meta: {
        source: PLATFORMS.LINKEDIN,
        description: "Created post on linkedin",
      },
    };

    setIsGenerating(true);
    var port = chrome.runtime.connect({ name: "vakya" });
    port.postMessage({ type: "getPrompt", promptData: PromptData });
    port.onMessage.addListener((msg) => {
      if (msg.message === "done") {
        setIsGenerating(false);
        return;
      } else if (msg.message === "success") {
        const { data } = msg;
        let prevText = qlEditor?.textContent;
        if (prevText === text) prevText = "";
        if (prevText?.includes("undefined")) {
          prevText = prevText?.replace("undefined", " ");
        }
        if (data?.includes("undefined")) {
          prevText = data?.replace("undefined", " ");
        }
        if (prevText === "Writing......") prevText = " ";
        qlEditor.textContent = prevText + data;
        setText(prevText + data);
      }
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "0") return;
    qlEditor.textContent = "Writing......";
    handleSubmitProfile(val);
    setIsDropdownOpen(false);
  };

  const SubmitGenerateThirdPerson = () => {
    // if (!name) return toast.error("Please enter ");
    const PromptData = {
      prompt: "",
      toneId: "",
      maxTokens: 100,
      numResponses: 1,
      categoryInfoId: PLATFORMS.LINKEDIN,
      additionalInfo: name,
      meta: {
        source: PLATFORMS.LINKEDIN,
        description: "Created post on linkedin",
      },
    };

    setIsGenerating(true);
    qlEditor.textContent = "Writing......";
    setIsDropdownOpen(false);
    var port = chrome.runtime.connect({ name: "vakya" });
    port.postMessage({ type: "getPrompt", promptData: PromptData });
    port.onMessage.addListener((msg) => {
      if (msg.message === "done") {
        setIsGenerating(false);
        setName("");
        return;
      } else if (msg.message === "success") {
        const { data } = msg;
        let prevText = qlEditor?.textContent;
        if (prevText === text) prevText = "";
        if (prevText?.includes("undefined")) {
          prevText = prevText?.replace("undefined", " ");
        }
        if (data?.includes("undefined")) {
          prevText = data?.replace("undefined", " ");
        }
        if (prevText === "Writing......") prevText = " ";
        qlEditor.textContent = prevText + data;
        setText(prevText + data);
      }
    });
  };

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
          <select
            disabled={isGenerating}
            className="selectLinkedin69 disabled:opacity-50 disabled:cursor-not-allowed"
            onChange={handleSelectChange}
          >
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
            <input
              type="text"
              placeholder="Write as"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              disabled={isGenerating || !name}
              onClick={SubmitGenerateThirdPerson}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default LinkedinComment;
