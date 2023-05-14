import React, { useEffect, useState, useRef } from "react";
import "../../assets/tailwind.css";
import { useAuth } from "../../options/AuthContext";
import { PLATFORMS } from "../config";
import { updateInput } from "./index";
import { ProfileType } from "../../api";
import { addLoading } from "../common";
import { removeLoading } from "../common";

const Twitter = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { profiles } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [name, setName] = useState("");
  const moreBtnId = document.getElementById("moreBtn69");

  useEffect(() => {
    const commentEl = document.querySelectorAll('[data-testid="cellInnerDiv"]');
    moreBtnId?.addEventListener("click", () => {
      setIsDropdownOpen(!isDropdownOpen);
      if (isDropdownOpen) {
        commentEl?.forEach((el: HTMLDivElement, i) => {
          if (i == 0 || i == 1) return;
          el?.style.setProperty("z-index", "1", "important");
        });
      } else {
        commentEl?.forEach((el: HTMLDivElement, i) => {
          if (i == 0 || i == 1) return;
          el?.style.setProperty("z-index", "-1", "important");
        });
      }
    });
    return () => {
      moreBtnId?.removeEventListener("click", () => {});
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isGenerating) addLoading(false);
    else removeLoading(false);
  }, [isGenerating]);

  const twitterTextArea = document.querySelector(
    '[data-testid="tweetTextarea_0"]'
  ) as HTMLTextAreaElement;
  useEffect(() => {
    twitterTextArea.click();
  }, []);

  const handleSubmitProfile = async (profileId: string) => {
    const tweitterPrompt = await chrome.storage.sync.get("twitterPrompt");
    const PromptData = {
      prompt: {
        description: tweitterPrompt.twitterPrompt,
      },
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
    // var port = chrome.runtime.connect({ name: "vakya" });
    // port.postMessage({ type: "getPrompt", promptData: PromptData });
    // port.onMessage.addListener((msg) => {
    //   if (msg.message === "done") {
    //     setIsGenerating(false);
    //     return;
    //   } else if (msg.message === "success") {
    //     const { data } = msg;
    //     let prevText = qlEditor?.textContent;
    //     if (prevText === text) prevText = "";
    //     if (prevText?.includes("undefined")) {
    //       prevText = prevText?.replace("undefined", " ");
    //     }
    //     if (data?.includes("undefined")) {
    //       prevText = data?.replace("undefined", " ");
    //     }
    //     if (prevText === "Writing......") prevText = " ";
    //     let txt = prevText + data;
    //     txt = txt.replace("undefined", " ");
    //     qlEditor.textContent = txt;
    //     // qlEditor.textContent = prevText + data;
    //     setText(txt);
    //   }
    // });
    setIsDropdownOpen(false);
    // qlEditor.textContent = "Writing......";
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          // let txtToSent = twitterTextArea.innerText;
          // if (txtToSent === "Writing......") txtToSent = " ";
          // txtToSent = resText;
          updateInput(twitterTextArea, resText);
          setIsGenerating(false);
        } else {
          setIsGenerating(false);
          updateInput(
            twitterTextArea,
            "Failed to generate text please try again"
          );
        }
      }
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "0") return;
    handleSubmitProfile(val);
    setIsDropdownOpen(false);
  };

  const SubmitGenerateThirdPerson = async () => {
    const prompt = await chrome.storage.sync.get("twitterPrompt");
    const PromptData = {
      prompt: {
        description: prompt,
      },
      toneId: "",
      maxTokens: 100,
      numResponses: 1,
      categoryInfoId: PLATFORMS.LINKEDIN,
      additionalInfo: name,
      meta: {
        source: PLATFORMS.LINKEDIN,
        description: "Created post on Twitter",
      },
    };

    setIsGenerating(true);
    setIsDropdownOpen(false);
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          updateInput(twitterTextArea, resText);
          setIsGenerating(false);
        } else {
          setIsGenerating(false);
          updateInput(
            twitterTextArea,
            "Failed to generate text please try again"
          );
        }
      }
    );
  };

  const twitterProfiles = profiles?.filter(
    (profile: ProfileType) => profile?.categoryInfoId == PLATFORMS.TWITTER
  );

  return isDropdownOpen ? (
    <div className="w-96 rounded-lg bg-dark flex flex-col space-y-6 p-4 z-50 border border-primary">
      <div className="flex items-start space-x-4">
        <img src={chrome.runtime.getURL("select.png")} className="w-5 h-4" />
        <div className="flex flex-col -mt-[2px]">
          <p className="font-medium text-white">Select Profile from Vakya</p>
          <p className="text-xs font-normal text-lightPurple2">
            Results will be generated based on your profile selection
          </p>
          <select
            onChange={handleSelectChange}
            className="w-full mt-3 px-4 h-11 bg-transparent border border-white rounded-lg text-white"
          >
            <option value="0">Select Profile</option>
            {twitterProfiles?.map((profile) => (
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-max h-10 px-2 text-sm text-white bg-transparent border-none focus:outline-none"
              placeholder="Write as"
            />
            <button
              onClick={SubmitGenerateThirdPerson}
              className="w-20 h-10 mr-1 text-sm text-white bg-primary rounded-lg border-none focus:outline-none"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Twitter;
