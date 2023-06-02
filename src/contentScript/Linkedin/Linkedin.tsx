import React, { useEffect, useState } from "react";
import { useAuth } from "../../options/AuthContext";
import { PLATFORMS, TONE_IDS } from "../config";
import { ProfileType } from "../../api";

const Linkedin = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedin, profiles } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

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
    // var port = chrome.runtime.connect({ name: "vakya" });

    // let ks =
    //   "facts about the human brainOur brain is the center of our nervous system and controls everything we do, from breathing to thinking. It's a fascinating organ that is still being studied to understand its capabilities and limitations. Here are some interesting facts about the human\n1. The human brain is made up of about100 billion neurons. These neurons are connected to each through trillions of synapses, which help transmit information between them\n2. Our brain consumes around20% of our body's energy, although it only weighs about2% of our total body weight3. Unlike most other cells in our body, neurons cannot replicate or reproduce.";

    // qlEditor.textContent = ks;
    // if (ks?.includes("\n")) {
    //   console.log("new line");
    //   qlEditor.append(document.createElement("br"));
    // } else {
    //   ks = ks.replace(/^\s+|\s+$/g, "");
    //   qlEditor.textContent = ks;
    // }

    // console.log("ks", ks);

    // port.postMessage({ type: "getStreamPrompt", promptData: PromptData });
    // port.onMessage.addListener((msg) => {
    //   if (msg.message === "done") {
    //     const qlEditorValue = qlEditor?.textContent;
    //     chrome.storage.sync.set({ responsetext: qlEditorValue });
    //     setIsGenerating(false);
    //     return;
    //   } else if (msg.message === "success") {
    //     const { data } = msg;
    //     let prevText = qlEditor?.textContent;
    //     if (prevText === text) prevText = "";
    //     if (prevText === "Writing......") prevText = " ";
    //     if (prevText?.includes("undefined")) {
    //       prevText = prevText?.replace("undefined", " ");
    //     }
    //     if (data?.includes("undefined")) {
    //       prevText = data?.replace("undefined", " ");
    //     }
    //     let txt = prevText + data;
    //     txt = txt.replace("undefined", " ");
    //     if (txt?.includes("\n")) {
    //       console.log("new line");
    //       // txt = txt + "/n";
    //     }

    //     txt = txt.replace(/^\s+|\s+$/g, "");
    //     // console.log("txt", txt);
    //     // console.log("txt123", txt.toString());

    //     qlEditor.textContent = txt.toString();
    //     //remove space from start
    //     // txt = txt.replace(/^\s+|\s+$/g, "");

    //     // qlEditor.textContent = txt;
    //     // qlEditor.textContent = prevText + data;
    //     setText(txt);
    //   }
    // });
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          let prevText = qlEditor?.textContent;
          const ptag = document.getElementById("failedLink69");
          if (ptag.style.display === "block") ptag.style.display = "none";
          if (prevText === text) prevText = "";
          if (prevText === "Writing......") prevText = " ";
          if (prevText?.includes("undefined")) {
            prevText = prevText?.replace("undefined", " ");
          }
          if (resText?.includes("undefined")) {
            prevText = resText?.replace("undefined", " ");
          }
          let txt = prevText + resText;
          txt = txt.replace(/^\s+|\s+$/g, "");
          qlEditor.textContent = txt;
          setIsGenerating(false);
          setText(txt);
          const qlEditorValue = qlEditor?.textContent;
          chrome.storage.sync.set({ responsetext: qlEditorValue });
        } else {
          setIsGenerating(false);
          //remove Writing......
          qlEditor.textContent = "";
          const ptag = document.getElementById("failedLink69");
          ptag.style.display = "block";
        }
      }
    );
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
    // var port = chrome.runtime.connect({ name: "vakya" });
    // port.postMessage({ type: "getStreamPrompt", promptData: PromptData });
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
    //     setText(txt);
    //   }
    // });
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          let prevText = qlEditor?.textContent;
          const ptag = document.getElementById("failed69");
          if (ptag.style.display === "block") ptag.style.display = "none";
          if (prevText === text) prevText = "";
          if (prevText === "Writing......") prevText = " ";
          if (prevText?.includes("undefined")) {
            prevText = prevText?.replace("undefined", " ");
          }
          if (resText?.includes("undefined")) {
            prevText = resText?.replace("undefined", " ");
          }
          let txt = prevText + resText;
          txt = txt.replace(/^\s+|\s+$/g, "");
          qlEditor.textContent = txt;
          setIsGenerating(false);
          setText(txt);
          const qlEditorValue = qlEditor?.textContent;
          chrome.storage.sync.set({ responsetext: qlEditorValue });
        } else {
          setIsGenerating(false);
          //remove Writing......
          qlEditor.textContent = "";
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
    // var port = chrome.runtime.connect({ name: "vakya" });
    // port.postMessage({ type: "getStreamPrompt", promptData: PromptData });
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
    //     setText(txt);
    //   }
    // });
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: PromptData },
      (response) => {
        if (response?.data?.length) {
          const resText = response.data[0];
          let prevText = qlEditor?.textContent;
          const ptag = document.getElementById("failed69");
          if (ptag.style.display === "block") ptag.style.display = "none";
          if (prevText === text) prevText = "";
          if (prevText === "Writing......") prevText = " ";
          if (prevText?.includes("undefined")) {
            prevText = prevText?.replace("undefined", " ");
          }
          if (resText?.includes("undefined")) {
            prevText = resText?.replace("undefined", " ");
          }
          let txt = prevText + resText;
          txt = txt.replace(/^\s+|\s+$/g, "");
          qlEditor.textContent = txt;
          setIsGenerating(false);
          setText(txt);
          const qlEditorValue = qlEditor?.textContent;
          chrome.storage.sync.set({ responsetext: qlEditorValue });
        } else {
          setIsGenerating(false);
          //remove Writing......
          qlEditor.textContent = "";
          const ptag = document.getElementById("failed69");
          ptag.style.display = "block";
        }
      }
    );
  };

  // console.log("profiles", profiles);
  const linkedinProfiles = profiles?.filter(
    (profile: ProfileType) => profile?.categoryInfoId == PLATFORMS.LINKEDIN
  );

  return isDropdownOpen ? (
    <div className="div__parentLinkedin69">
      {linkedinProfiles?.length > 0 ? (
        <div className="cmn__cls69">
          <img
            src={chrome.runtime.getURL("select.png")}
            style={{
              width: "24px",
            }}
          />
          <div className="linkedin__cmn2">
            <p
              className="linkedin__dropCol69"
              style={{
                fontSize: "14px",
              }}
            >
              Select Profile from Vakya
            </p>
            <p
              className="linkedin__dropCol691"
              style={{
                fontSize: "10px",
              }}
            >
              Results will be generated based on your profile selection
            </p>
            <select
              disabled={isGenerating}
              className="selectLinkedin69 disabled__cls69"
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
          <p
            className="linkedin__dropCol69"
            style={{
              fontSize: "14px",
            }}
          >
            Create New Profile
          </p>
          <p
            className="linkedin__dropCol691"
            style={{
              fontSize: "10px",
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
          <p
            className="linkedin__dropCol69"
            style={{
              fontSize: "14px",
            }}
          >
            Write as
          </p>
          <p
            className="linkedin__dropCol691"
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
              className="disabled__cls69"
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
