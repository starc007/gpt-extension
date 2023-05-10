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

  // var port = chrome.runtime.connect({ name: "vakya" });
  // port.postMessage({ type: "getPrompt", promptData: PromptData });
  // port.onMessage.addListener((msg) => {
  //   if (msg.message === "done") {
  //     setIsGenerating(false);
  //     return;
  //   } else if (msg.message === "success") {
  //     const { data } = msg;
  //     console.log("data", data);
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

  const handleSubmit = (prompt: string, toneId: string) => {
    setFormData({ prompt, toneId, profileId: "", additionalInfo: "" });
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

    qlEditor.textContent = "Writing......";
    setText(text);
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          let txtToSent = qlEditor?.textContent;
          if (txtToSent === "Writing......") txtToSent = " ";
          txtToSent = resText;
          qlEditor.textContent = txtToSent;
          setIsGenerating(false);
          setText(txtToSent);
        } else {
          toast.error("Something went wrong please try again");
          setIsGenerating(false);
          qlEditor.textContent = "Failed to generate text please try again";
        }
      }
    );
  };

  useEffect(() => {
    if (isLoggedin) {
      funnyBtn69.addEventListener("click", () => {
        const qlEditorValue = qlEditor?.textContent;
        setIsDropdownOpen(false);
        handleSubmit(qlEditorValue, TONE_IDS.FUNNY);
      });

      interestingBtn69.addEventListener("click", () => {
        const qlEditorValue = qlEditor?.textContent;
        setIsDropdownOpen(false);
        handleSubmit(qlEditorValue, TONE_IDS.INTERESTING);
      });

      qaBtn69.addEventListener("click", () => {
        const qlEditorValue = qlEditor?.textContent;
        setIsDropdownOpen(false);
        handleSubmit(qlEditorValue, TONE_IDS.QUESTION);
      });

      regenerateBtn69.addEventListener("click", () => {
        if (!formData.toneId) return;
        handleSubmit(formData.prompt, formData.toneId);
      });
    }
  }, [isLoggedin, formData]);

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

  const handleSubmitProfile = (profileId: string) => {
    setFormData({ prompt: "", toneId: "", profileId, additionalInfo: "" });
    const PromptData = {
      prompt: "",
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
    setText(text);
    qlEditor.textContent = "Writing......";
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          let txtToSent = qlEditor?.textContent;
          if (txtToSent === "Writing......") txtToSent = " ";
          txtToSent = resText;
          qlEditor.textContent = txtToSent;
          setIsGenerating(false);
          setText(txtToSent);
        } else {
          toast.error("Something went wrong please try again");
          setIsGenerating(false);
          qlEditor.textContent = "Failed to generate text please try again";
        }
      }
    );
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
    setFormData({
      prompt: "",
      toneId: "",
      profileId: "",
      additionalInfo: name,
    });
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
    setText(text);
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          let txtToSent = qlEditor?.textContent;
          if (txtToSent === "Writing......") txtToSent = " ";
          txtToSent = resText;
          qlEditor.textContent = txtToSent;
          setIsGenerating(false);
          setText(txtToSent);
        } else {
          toast.error("Something went wrong please try again");
          setIsGenerating(false);
          qlEditor.textContent = "Failed to generate text please try again";
        }
      }
    );
  };

  // console.log("profiles", profiles);
  const linkedinProfiles = profiles?.filter(
    (profile: ProfileType) => profile?.categoryInfoId == PLATFORMS.LINKEDIN
  );

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
            {linkedinProfiles.map((profile) => (
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
