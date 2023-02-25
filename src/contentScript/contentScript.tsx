import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ProfileType } from "../api";

const toneOptions = [
  {
    value: 1,
    label: "Informal",
  },
  {
    value: 2,
    label: "Neutral",
  },
  {
    value: 3,
    label: "Formal",
  },
  {
    value: 4,
    label: "Friendly",
  },
  {
    value: 5,
    label: "Sarcastic",
  },
  {
    value: 6,
    label: "Confident",
  },
  {
    value: 7,
    label: "Optimistic",
  },
  {
    value: 8,
    label: "Knowledgeable",
  },
];

const wordOptions = [
  {
    value: 50,
    label: "Approx 50 words",
  },
  {
    value: 100,
    label: "Approx 100 words",
  },
  {
    value: 150,
    label: "Approx 150 words",
  },
  {
    value: 200,
    label: "Approx 200 words",
  },
];

const contentScript = () => {
  const [jdText, setJdText] = useState<string | undefined>(undefined);
  const [isOpen, setIsopen] = useState(false);
  const [errMsg, setErrMsg] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<{
    success: boolean;
    loader: boolean;
  }>({
    success: false,
    loader: false,
  });
  const [profiles, setProfiles] = useState<
    | {
        label: string;
        value: string;
      }[]
    | []
  >([]);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    prompt: "",
    maxTokens: wordOptions[0].value,
    numResponses: 1,
    toneId: toneOptions[1].value,
    categoryInfoId: 1,
    customToneId: "", //profileid
    additionalInfo: "",
  });

  useEffect(() => {
    const JD = document.getElementById("up-truncation-1");
    const JDText = JD?.innerText;
    setJdText(JDText);
    setFormData({ ...formData, prompt: JDText });
    const btn1 = document.getElementById("ctOpen69");
    const btn2 = document.getElementById("littleIcn69");

    btn1?.addEventListener("click", () => {
      setIsopen(true);
    });

    btn2?.addEventListener("click", () => {
      setIsopen(true);
    });

    return () => {
      btn1?.removeEventListener("click", () => {});
      btn2?.removeEventListener("click", () => {});
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      chrome.storage.sync.get("isLoggedin", (result) => {
        setIsLoggedin(result.isLoggedin);
        if (result.isLoggedin) {
          chrome.runtime.sendMessage({ type: "fetchProfiles" }, (response) => {
            if (response?.profiles?.length) {
              const options = response.profiles.map((profile: ProfileType) => {
                return {
                  value: profile.id,
                  label: profile.toneDescription.title,
                };
              });
              setProfiles(options);
            } else {
              setProfiles([]);
            }
          });
        }
      });
    }
  }, [isOpen]);

  const ToggleSidebar = () => {
    isOpen === true ? setIsopen(false) : setIsopen(true);
  };

  const fillDetails = () => {
    console.log("filling details");
    const textArea = document.querySelector<HTMLElement>(
      "[aria-labelledby='cover_letter_label']"
    );
    textArea.innerText = generatedResponse;
  };

  const handleSubmit = () => {
    if (!isLoggedin) {
      setErrMsg("Please login to use this feature");
      return;
    }

    if (profiles.length === 0) {
      setErrMsg("Please create a profile to use this feature");
      return;
    }

    setIsGenerating({
      success: false,
      loader: true,
    });
    setErrMsg("");
    chrome.runtime.sendMessage(
      { type: "getPrompt", promptData: formData },
      (response) => {
        console.log("response 69", response);
        if (response?.data?.length) {
          setGeneratedResponse(response.data[0]);
          setIsGenerating({
            success: true,
            loader: false,
          });
        } else {
          setErrMsg("Something went wrong");
          setIsGenerating({
            success: false,
            loader: false,
          });
        }
      }
    );
  };

  return (
    <>
      <div className="container-fluid">
        <div className={`sidebar ${isOpen == true ? "active" : ""}`}>
          <div className="sb__header69">
            <div
              className="sb__content69"
              style={{
                padding: "0",
              }}
            >
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                Smart A.I Cover Letter Writer
              </p>
            </div>
            <button
              style={{
                fontSize: "1.3rem",
                fontWeight: "600",
                background: "none",
                outline: "none",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={ToggleSidebar}
            >
              x
            </button>
          </div>
          <div className="sb__content69">
            <Select
              options={
                profiles.length
                  ? profiles
                  : [{ value: "69", label: "Create your profile" }]
              }
              placeholder="Select Profile"
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
              }}
              onChange={(e) =>
                setFormData({ ...formData, customToneId: e.value })
              }
            />
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <Select
                options={toneOptions}
                placeholder="Select Tone"
                defaultValue={toneOptions[0]}
                className="select__width69"
                onChange={(e) => setFormData({ ...formData, toneId: e.value })}
              />
              <Select
                options={wordOptions}
                placeholder="Select Words Count"
                defaultValue={wordOptions[0]}
                className="select__width69"
                onChange={(e) =>
                  setFormData({ ...formData, maxTokens: e.value })
                }
              />
            </div>
            <textarea
              className="text__area69"
              placeholder="Additional Information"
              rows={4}
              onChange={(e) =>
                setFormData({ ...formData, additionalInfo: e.target.value })
              }
            ></textarea>

            {isGenerating.loader ? (
              <div className="loading_parent69">
                <div className="loading__div69"></div>
                <div className="loading__div69"></div>
                <div className="loading__div69"></div>
              </div>
            ) : isGenerating.success ? (
              <div>
                <p
                  style={{
                    paddingTop: "10px",
                  }}
                >
                  Generated Response
                </p>
                <textarea
                  className="text__area69"
                  rows={6}
                  value={
                    //remove /n from generated response
                    generatedResponse?.replace(/(\r\n|\n|\r)/gm, " ")
                  }
                  onChange={(e) => setGeneratedResponse(e.target.value)}
                ></textarea>
              </div>
            ) : (
              <p>{errMsg}</p>
            )}

            {errMsg && <p>{errMsg}</p>}
          </div>

          {/* <p>
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              Job Description:
            </span>{" "}
            {jdText}
          </p> */}
          <div className="bottom__btn69">
            <button className="fill__btn69" onClick={fillDetails}>
              Fill
            </button>
            <button
              disabled={isGenerating.loader}
              onClick={handleSubmit}
              className="generate__btn69"
            >
              {isGenerating.loader
                ? "Generating..."
                : isGenerating.success
                ? "Generated"
                : "Generate"}
            </button>
          </div>
        </div>
        <div
          className={`sidebar-overlay ${isOpen == true ? "active" : ""}`}
          onClick={ToggleSidebar}
        ></div>
      </div>
    </>
  );
};

export default contentScript;
