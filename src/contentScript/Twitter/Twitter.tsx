import React, { useEffect, useState } from "react";
import { useAuth } from "../../options/AuthContext";
import { MAX_WORDS, PLATFORMS, TONE_IDS } from "../config";
import { findClosestInput, findCurrentTweetText, updateInput } from "./index";
import { ProfileType } from "../../api";
import { addLoading } from "../common";
import { removeLoading } from "../common";

// import "../../assets/tailwind.css";

const Twitter = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { profiles } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [name, setName] = useState("");
  const moreBtnId = document.getElementById("moreBtn69");

  useEffect(() => {
    const commentEl = document.querySelectorAll('[data-testid="cellInnerDiv"]');
    const containerId = document.getElementById("containerVakya69");
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
    document.addEventListener("click", (e) => {
      const isDropdown =
        e.target === moreBtnId ||
        e.target === containerId ||
        containerId?.contains(e.target as Node);

      if (!isDropdown) {
        setIsDropdownOpen(false);
        commentEl?.forEach((el: HTMLDivElement, i) => {
          if (i == 0 || i == 1) return;
          el?.style.setProperty("z-index", "-1", "important");
        });
      }
    });
    return () => {
      moreBtnId?.removeEventListener("click", () => {});
      document.removeEventListener("click", () => {});
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isGenerating) addLoading(false);
    else removeLoading(false);
  }, [isGenerating]);

  // const twitterTextArea = document.querySelector(
  //   '[data-testid="tweetTextarea_0"]'
  // ) as HTMLTextAreaElement;
  // useEffect(() => {
  //   const url = window.location.href;
  //   if (url.includes("compose/tweet")) {
  //   } else {
  //     // twitterTextArea.click();
  //   }
  // }, []);

  const handleSubmitProfile = async (profileId: string) => {
    const isTweet = document.querySelector(
      '[data-testid="tweetButtonInline"]'
    ).textContent;
    const regenerateBtn69 = document.getElementById("regenerateBtn69");

    // const twitterTextArea = document.querySelector(
    //   '[data-testid="tweetTextarea_0"]'
    // ) as any;
    const toolbar = document.querySelector('[data-testid="toolBar"]');
    const twitterTextArea = findClosestInput(toolbar);
    let text = twitterTextArea.innerText;
    const currentTweetText = findCurrentTweetText();

    let promptToSend = "";
    const respText = await chrome.storage.sync.get("twitterRes");
    const oldPrompt = await chrome.storage.sync.get("oldTwittePrompt");
    if (respText?.twitterRes && text === respText.twitterRes) {
      promptToSend = oldPrompt.oldTwittePrompt;
    } else {
      promptToSend = text;
    }

    const PromptData = {
      prompt: {
        description: isTweet === "Reply" ? currentTweetText : promptToSend,
      },
      toneId: "",
      maxTokens: MAX_WORDS.TWITTER,
      numResponses: 1,
      customToneId: profileId,
      categoryInfoId: PLATFORMS.TWITTER,
      meta: {
        source:
          isTweet === "Reply" ? PLATFORMS.LINKEDIN_COMMENT : PLATFORMS.TWITTER,
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
    const spinerId = document.getElementById("spinner69");
    spinerId.style.display = "block";
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      async (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          const txt = resText
            .trim()
            .replace(/^\"/g, "")
            .replace(/\"$/g, "")
            .trim();
          const ptag = document.getElementById("failed69");
          if (ptag.style.display === "block") ptag.style.display = "none";
          chrome.storage.sync.set({ twitterRes: txt });
          chrome.storage.sync.set({ twitterProfileId: profileId });
          //remove oldTwitterToneId
          chrome.storage.sync.set({ oldTwitterToneId: null });
          regenerateBtn69.style.display = "flex";
          updateInput(twitterTextArea, txt);
          setIsGenerating(false);
          spinerId.style.display = "none";
        } else {
          setIsGenerating(false);
          spinerId.style.display = "none";
          const ptag = document.getElementById("failed69");
          ptag.style.display = "block";
          regenerateBtn69.style.display = "none";
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
    const regenerateBtn69 = document.getElementById("regenerateBtn69");
    const isTweet = document.querySelector(
      '[data-testid="tweetButtonInline"]'
    ).textContent;

    // const twitterTextArea = document.querySelector(
    //   '[data-testid="tweetTextarea_0"]'
    // ) as any;
    const toolbar = document.querySelector('[data-testid="toolBar"]');
    const twitterTextArea = findClosestInput(toolbar);
    let text = twitterTextArea.innerText;
    const currentTweetText = findCurrentTweetText();

    let promptToSend = "";
    const respText = await chrome.storage.sync.get("twitterRes");
    const oldPrompt = await chrome.storage.sync.get("oldTwittePrompt");
    if (respText?.twitterRes && text === respText.twitterRes) {
      promptToSend = oldPrompt.oldTwittePrompt;
    } else {
      promptToSend = text;
    }

    const PromptData = {
      prompt: {
        description: isTweet === "Reply" ? currentTweetText : promptToSend,
      },
      toneId: TONE_IDS.WRITE_AS,
      maxTokens: MAX_WORDS.TWITTER,
      numResponses: 1,
      categoryInfoId: PLATFORMS.TWITTER,
      additionalInfo: name,
      meta: {
        source:
          isTweet === "Reply" ? PLATFORMS.LINKEDIN_COMMENT : PLATFORMS.TWITTER,
        description:
          isTweet === "Reply" ? "reply to a tweet" : "Created post on twitter",
      },
    };

    setIsGenerating(true);
    setIsDropdownOpen(false);
    const spinerId = document.getElementById("spinner69");
    spinerId.style.display = "block";
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      async (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          const ptag = document.getElementById("failed69");
          if (ptag.style.display === "block") ptag.style.display = "none";
          chrome.storage.sync.set({ twitterRes: resText });
          chrome.storage.sync.set({ twitterProfileId: null });
          chrome.storage.sync.set({ oldTwitterToneId: TONE_IDS.WRITE_AS });
          chrome.storage.sync.set({ twitterAditionalInfo: name });

          updateInput(twitterTextArea, resText);
          setIsGenerating(false);
          setName("");
          regenerateBtn69.style.display = "flex";
          spinerId.style.display = "none";
        } else {
          setIsGenerating(false);
          spinerId.style.display = "none";
          setName("");
          const ptag = document.getElementById("failed69");
          ptag.style.display = "block";
          regenerateBtn69.style.display = "none";
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
                paddingTop: "3px",
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
            width: "22px",
          }}
        />
        <div
          onClick={() => {
            window.open(
              "https://test.vakya.ai/dashboard/profile?showModal=true",
              "_blank"
            );
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
              paddingTop: "3px",
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
            width: "22px",
          }}
        />
        <div className="linkedin__cmn2">
          <p className="linkedin__dropCol69">Write as</p>
          <p
            className="linkedin__dropCol691"
            style={{
              fontSize: "12px",
              paddingTop: "3px",
            }}
          >
            Write description of a persona (person or specific personality) you
            want vakya to generate results as.
          </p>
          <div
            className="divTwitter__moreBtn69"
            style={{
              border: "1px solid #E5E5E5",
              padding: "0.2rem 0",
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
