import React, { useEffect, useState } from "react";
import "../../assets/tailwind.css";
import { useAuth } from "../../options/AuthContext";
import { PLATFORMS, TONE_IDS } from "../config";
import { ProfileType } from "../../api";
import { toast } from "react-hot-toast";

const Linkedin = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedin, profiles } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    prompt: "",
    toneId: "",
    profileId: "",
    additionalInfo: "",
  });

  const moreBtnId = document.getElementById("moreBtn69");
  const funnyBtn69 = document.getElementById("funnyBtn69");
  const interestingBtn69 = document.getElementById("interestingBtn69");
  const qaBtn69 = document.getElementById("qaBtn69");
  const regenerateBtn69 = document.getElementById("regenerateBtn69");
  useEffect(() => {
    moreBtnId?.addEventListener("click", () => {
      setIsDropdownOpen(!isDropdownOpen);
    });

    return () => {
      moreBtnId?.removeEventListener("click", () => {});
    };
  }, [isDropdownOpen]);
  const qlEditor = document?.querySelector(".ql-editor");

  const handleSubmit = (prompt: string, toneId: string) => {
    setFormData({ prompt, toneId, profileId: "", additionalInfo: "" });
    chrome.storage.sync.set({
      linkedinPrompt: prompt,
      toneIdLinkedin: toneId,
    });
    const PromptData = {
      prompt: {
        description: prompt,
      },
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

    qlEditor.textContent = "Writing......";
    var port = chrome.runtime.connect({ name: "vakya" });
    port.postMessage({ type: "getStreamPrompt", promptData: PromptData });
    port.onMessage.addListener((msg) => {
      if (msg.message === "done") {
        const qlEditorValue = qlEditor?.textContent;
        chrome.storage.sync.set({ responsetext: qlEditorValue });
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
        let txt = prevText + data;
        txt = txt.replace("undefined", " ");
        qlEditor.textContent = txt;
        // qlEditor.textContent = prevText + data;
        setText(txt);
      }
    });
  };

  useEffect(() => {
    if (isLoggedin) {
      funnyBtn69.addEventListener("click", async () => {
        const qlEditorValue = qlEditor?.textContent;
        setIsDropdownOpen(false);
        if (qlEditorValue === "Writing......") return;

        const prompt = await chrome.storage.sync.get("responsetext");

        if (prompt.responsetext === qlEditorValue) {
          const oldPrompt = await chrome.storage.sync.get("linkedinPrompt");
          handleSubmit(oldPrompt.linkedinPrompt, TONE_IDS.FUNNY);
        } else {
          handleSubmit(qlEditorValue, TONE_IDS.FUNNY);
        }
      });

      interestingBtn69.addEventListener("click", async () => {
        const qlEditorValue = qlEditor?.textContent;
        setIsDropdownOpen(false);
        if (qlEditorValue === "Writing......") return;
        const prompt = await chrome.storage.sync.get("responsetext");
        if (prompt.responsetext === qlEditorValue) {
          const oldPrompt = await chrome.storage.sync.get("linkedinPrompt");
          handleSubmit(oldPrompt.linkedinPrompt, TONE_IDS.INTERESTING);
        } else {
          handleSubmit(qlEditorValue, TONE_IDS.INTERESTING);
        }
        // handleSubmit(qlEditorValue, TONE_IDS.INTERESTING);
      });

      qaBtn69.addEventListener("click", async () => {
        const qlEditorValue = qlEditor?.textContent;
        setIsDropdownOpen(false);
        if (qlEditorValue === "Writing......") return;
        const prompt = await chrome.storage.sync.get("responsetext");
        if (prompt.responsetext === qlEditorValue) {
          const oldPrompt = await chrome.storage.sync.get("linkedinPrompt");
          handleSubmit(oldPrompt.linkedinPrompt, TONE_IDS.QUESTION);
        } else {
          handleSubmit(qlEditorValue, TONE_IDS.QUESTION);
        }
      });

      regenerateBtn69.addEventListener("click", async () => {
        const prompt = await chrome.storage.sync.get("linkedinPrompt");
        const toneId = await chrome.storage.sync.get("toneIdLinkedin");
        handleSubmit(prompt.linkedinPrompt, toneId.toneIdLinkedin);
      });
    }

    return () => {
      funnyBtn69?.removeEventListener("click", () => {});
      interestingBtn69?.removeEventListener("click", () => {});
      qaBtn69?.removeEventListener("click", () => {});
      regenerateBtn69?.removeEventListener("click", () => {});
    };
  }, [isLoggedin]);

  const handleGenerate = () => {
    if (isGenerating) {
      funnyBtn69?.setAttribute("disabled", "true");
      funnyBtn69?.style.setProperty("cursor", "not-allowed");
      interestingBtn69?.setAttribute("disabled", "true");
      interestingBtn69?.style.setProperty("cursor", "not-allowed");
      qaBtn69?.setAttribute("disabled", "true");
      qaBtn69?.style.setProperty("cursor", "not-allowed");
      moreBtnId?.setAttribute("disabled", "true");
      moreBtnId?.style.setProperty("cursor", "not-allowed");
      regenerateBtn69?.style.setProperty("display", "none");
    } else {
      funnyBtn69?.removeAttribute("disabled");
      funnyBtn69?.style.setProperty("cursor", "pointer");
      interestingBtn69?.removeAttribute("disabled");
      interestingBtn69?.style.setProperty("cursor", "pointer");
      qaBtn69?.removeAttribute("disabled");
      qaBtn69?.style.setProperty("cursor", "pointer");
      moreBtnId?.removeAttribute("disabled");
      moreBtnId?.style.setProperty("cursor", "pointer");

      const qlEditorValue = qlEditor?.textContent;
      if (qlEditorValue.length === 0 || !qlEditorValue || text.length === 0) {
        regenerateBtn69?.style.setProperty("display", "none");
      } else {
        regenerateBtn69?.style.setProperty("display", "block");
      }
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [isGenerating, text]);

  if (!isLoggedin) return null;

  const handleSubmitProfile = async (profileId: string) => {
    let txtPrompt = "";
    const qlEditorValue = qlEditor?.textContent;
    if (qlEditorValue === "Writing......") return;
    const prompt = await chrome.storage.sync.get("responsetext");
    if (prompt.responsetext === qlEditorValue) {
      const oldPrompt = await chrome.storage.sync.get("linkedinPrompt");
      txtPrompt = oldPrompt.linkedinPrompt;
    } else {
      txtPrompt = qlEditorValue;
    }

    const PromptData = {
      prompt: {
        description: txtPrompt,
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
    setIsDropdownOpen(false);
    qlEditor.textContent = "Writing......";
    var port = chrome.runtime.connect({ name: "vakya" });
    port.postMessage({ type: "getStreamPrompt", promptData: PromptData });
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
        let txt = prevText + data;
        txt = txt.replace("undefined", " ");
        qlEditor.textContent = txt;
        setText(txt);
      }
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "0") return;
    handleSubmitProfile(val);
    setIsDropdownOpen(false);
  };

  const SubmitGenerateThirdPerson = async () => {
    // if (!name) return toast.error("Please enter ");
    let txtPrompt = "";
    const qlEditorValue = qlEditor?.textContent;
    if (qlEditorValue === "Writing......") return;
    const prompt = await chrome.storage.sync.get("responsetext");
    if (prompt.responsetext === qlEditorValue) {
      const oldPrompt = await chrome.storage.sync.get("linkedinPrompt");
      txtPrompt = oldPrompt.linkedinPrompt;
    } else {
      txtPrompt = qlEditorValue;
    }
    const PromptData = {
      prompt: {
        description: txtPrompt,
      },
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
    setIsDropdownOpen(false);
    var port = chrome.runtime.connect({ name: "vakya" });
    port.postMessage({ type: "getStreamPrompt", promptData: PromptData });
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
        let txt = prevText + data;
        txt = txt.replace("undefined", " ");
        qlEditor.textContent = txt;
        setText(txt);
      }
    });
  };

  // console.log("profiles", profiles);
  const linkedinProfiles = profiles?.filter(
    (profile: ProfileType) => profile?.categoryInfoId == PLATFORMS.LINKEDIN
  );

  return isDropdownOpen ? (
    <div className="w-[30rem] rounded-lg bg-dark flex flex-col space-y-6 p-4 border border-primary">
      {linkedinProfiles?.length > 0 ? (
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
              {linkedinProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile?.toneDescription?.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
      <div className="flex items-start space-x-4">
        <img src={chrome.runtime.getURL("userplus.png")} className="w-6" />
        <div
          onClick={() => {
            window.open("https://test.vakya.ai/dashboard/profile", "_blank");
            setIsDropdownOpen(false);
          }}
          className="flex flex-col -mt-[2px] cursor-pointer"
        >
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
            className="font-medium dark:text-white text-black"
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

export default Linkedin;
