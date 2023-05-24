import React, { useEffect, useState } from "react";
import { useAuth } from "../../options/AuthContext";
import { PLATFORMS } from "../config";
import { findCurrentTweetText, updateInput } from "./index";
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
    const isTweet = document.querySelector(
      '[data-testid="tweetButtonInline"]'
    ).textContent;

    const twitterTextArea = document.querySelector(
      '[data-testid="tweetTextarea_0"]'
    ) as any;
    let text = twitterTextArea.innerText;
    const currentTweetText = findCurrentTweetText();

    const PromptData = {
      prompt: {
        description: isTweet === "Reply" ? currentTweetText : text,
      },
      toneId: "",
      maxTokens: 100,
      numResponses: 1,
      customToneId: profileId,
      categoryInfoId: PLATFORMS.TWITTER,
      meta: {
        source: PLATFORMS.TWITTER,
        description:
          isTweet === "Reply" ? "reply to a tweet" : "Created post on twitter",
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
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          const ptag = document.getElementById("failed69");
          if (ptag.style.display === "block") ptag.style.display = "none";
          updateInput(twitterTextArea, resText);
          setIsGenerating(false);
        } else {
          setIsGenerating(false);
          const ptag = document.getElementById("failed69");
          ptag.style.display = "block";
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
    const isTweet = document.querySelector(
      '[data-testid="tweetButtonInline"]'
    ).textContent;

    const twitterTextArea = document.querySelector(
      '[data-testid="tweetTextarea_0"]'
    ) as any;
    let text = twitterTextArea.innerText;
    const currentTweetText = findCurrentTweetText();

    const PromptData = {
      prompt: {
        description: isTweet === "Reply" ? currentTweetText : text,
      },
      toneId: "",
      maxTokens: 100,
      numResponses: 1,
      categoryInfoId: PLATFORMS.TWITTER,
      additionalInfo: name,
      meta: {
        source: PLATFORMS.TWITTER,
        description:
          isTweet === "Reply" ? "reply to a tweet" : "Created post on twitter",
      },
    };

    setIsGenerating(true);
    setIsDropdownOpen(false);
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          const ptag = document.getElementById("failed69");
          if (ptag.style.display === "block") ptag.style.display = "none";
          updateInput(twitterTextArea, resText);
          setIsGenerating(false);
        } else {
          setIsGenerating(false);
          const ptag = document.getElementById("failed69");
          ptag.style.display = "block";
        }
      }
    );
  };

  const twitterProfiles = profiles?.filter(
    (profile: ProfileType) => profile?.categoryInfoId == PLATFORMS.TWITTER
  );

  return isDropdownOpen ? (
    <div className="twitter__parent69">
      {twitterProfiles?.length > 0 ? (
        <div className="cmn__cls69">
          <img
            src={chrome.runtime.getURL("select.png")}
            style={{
              width: "20px",
              height: "16px",
            }}
          />
          <div className="linkedin__cmn2">
            <p className="linkedin__dropCol69">Select Profile from Vakya</p>
            <p
              className="linkedin__dropCol691"
              style={{
                fontSize: "12px",
              }}
            >
              Results will be generated based on your profile selection
            </p>
            <select onChange={handleSelectChange} className="twitter__select69">
              <option value="0">Select Profile</option>
              {twitterProfiles?.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile?.toneDescription?.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
      <div className="cmn__cls69">
        <img
          src={chrome.runtime.getURL("userplus.png")}
          style={{
            width: "24px",
          }}
        />
        <div
          onClick={() => {
            window.open("https://test.vakya.ai/dashboard/profile", "_blank");
            setIsDropdownOpen(false);
          }}
          className="linkedin__cmn2"
          style={{
            cursor: "pointer",
          }}
        >
          <p className="linkedin__dropCol69">Create New Profile</p>
          <p
            className="linkedin__dropCol691"
            style={{
              fontSize: "12px",
            }}
          >
            Create profile the way you want vakya to answer for you
          </p>
        </div>
      </div>
      <div className="cmn__cls69">
        <img
          src={chrome.runtime.getURL("usercheck.png")}
          style={{
            width: "24px",
          }}
        />
        <div className="linkedin__cmn2">
          <p className="linkedin__dropCol69">Write as</p>
          <p
            className="linkedin__dropCol691"
            style={{
              fontSize: "12px",
            }}
          >
            Write description of a persona (person or specific personality) you
            want vakya to generate results as.
          </p>
          <div
            className="divLinkedin__moreBtn69"
            style={{
              border: "1px solid #E5E5E5",
            }}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // className="w-max h-10 px-2 text-sm text-white bg-transparent border-none focus:outline-none"
              placeholder="Write as"
            />
            <button
              onClick={SubmitGenerateThirdPerson}
              // className="w-20 h-10 mr-1 text-sm text-white bg-primary rounded-lg border-none focus:outline-none"
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
