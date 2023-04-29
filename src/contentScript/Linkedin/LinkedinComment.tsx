import React, { useEffect, useState } from "react";
import "../../assets/tailwind.css";
import { useAuth } from "../../options/AuthContext";
import { PLATFORMS, TONE_IDS } from "../config";
import { toast } from "react-hot-toast";

function getLinkedInText(elem: any) {
  const text = elem
    .closest(".feed-shared-update-v2")
    .querySelector(".feed-shared-update-v2__description")
    .textContent.trim()
    .replaceAll("\n", "")
    .replaceAll("…see more", "");
  return text;
}

const LinkedinComment = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedin, profiles } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    prompt: "",
    toneId: "",
  });

  const moreBtnId = document.getElementById("moreCommentBtn69");
  const funnyBtn69 = document.getElementById("funnyCommentBtn69");
  const agreeBtn69 = document.getElementById("agreeBtnBtn69");
  const disagreeBtn69 = document.getElementById("disagreeBtn69");
  //   const interestingBtn69 = document.getElementById("interestingBtn69");
  const qaBtn69 = document.getElementById("questionBtn69");
  const regenerateBtn69 = document.getElementById("regenerateBtn69");
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

    setIsGenerating(true);
    var port = chrome.runtime.connect({ name: "vakya" });
    qlEditor.textContent = "Writing......";
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

  useEffect(() => {
    if (isLoggedin) {
      funnyBtn69.addEventListener("click", () => {
        const text = getLinkedInText(qlEditor);
        // setFormData({
        //   ...formData,
        //   prompt: text,
        //   toneId: TONE_IDS.FUNNY,
        // });
        // handleSubmit(qlEditorValue, TONE_IDS.FUNNY);
        console.log("funnyBtn69");
      });

      //   agreeBtn69.addEventListener("click", () => {
      //     const qlEditorValue = qlEditor?.textContent;
      //     setFormData({
      //       ...formData,
      //       prompt: qlEditorValue,
      //       toneId: TONE_IDS.LIKE,
      //     });
      //     handleSubmit(qlEditorValue, TONE_IDS.LIKE);
      //   });

      //   disagreeBtn69.addEventListener("click", () => {
      //     const qlEditorValue = qlEditor?.textContent;
      //     setFormData({
      //       ...formData,
      //       prompt: qlEditorValue,
      //       toneId: TONE_IDS.DISLIKE,
      //     });
      //     handleSubmit(qlEditorValue, TONE_IDS.DISLIKE);
      //   });

      //   qaBtn69.addEventListener("click", () => {
      //     const qlEditorValue = qlEditor?.textContent;
      //     setFormData({
      //       ...formData,
      //       prompt: qlEditorValue,
      //       toneId: TONE_IDS.QUESTION,
      //     });
      //     handleSubmit(qlEditorValue, TONE_IDS.QUESTION);
      //   });

      regenerateBtn69.addEventListener("click", () => {
        handleSubmit(formData.prompt, formData.toneId);
      });
    }
  }, [isLoggedin]);

  const handleGenerate = () => {
    if (isGenerating) {
      funnyBtn69?.setAttribute("disabled", "true");
      funnyBtn69?.style.setProperty("cursor", "not-allowed");
      agreeBtn69?.setAttribute("disabled", "true");
      agreeBtn69?.style.setProperty("cursor", "not-allowed");
      disagreeBtn69?.setAttribute("disabled", "true");
      disagreeBtn69?.style.setProperty("cursor", "not-allowed");
      qaBtn69?.setAttribute("disabled", "true");
      qaBtn69?.style.setProperty("cursor", "not-allowed");
      moreBtnId?.setAttribute("disabled", "true");
      moreBtnId?.style.setProperty("cursor", "not-allowed");
      regenerateBtn69?.style.setProperty("display", "none");
    } else {
      funnyBtn69?.removeAttribute("disabled");
      funnyBtn69?.style.setProperty("cursor", "pointer");
      agreeBtn69?.removeAttribute("disabled");
      agreeBtn69?.style.setProperty("cursor", "pointer");
      disagreeBtn69?.removeAttribute("disabled");
      disagreeBtn69?.style.setProperty("cursor", "pointer");
      qaBtn69?.removeAttribute("disabled");
      qaBtn69?.style.setProperty("cursor", "pointer");
      moreBtnId?.removeAttribute("disabled");
      moreBtnId?.style.setProperty("cursor", "pointer");

      const qlEditorValue = qlEditor?.textContent;
      if (
        qlEditorValue.length === 0 ||
        !qlEditorValue ||
        text !== qlEditorValue
      ) {
        regenerateBtn69?.style.setProperty("display", "none");
      } else {
        regenerateBtn69?.style.setProperty("display", "block");
      }
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [isGenerating]);

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

  console.log("isGenerating", isGenerating);

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
