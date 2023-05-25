import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Select, { components } from "react-select";
import Lottie from "lottie-react";
import { ProfileType } from "../api";
import Login from "../options/Login";

import GenerateAnimation from "./GenerateAnimation.json";

// import "../assets/tailwind.css";
// import "../assets/styles.css";
import { useAuth } from "../options/AuthContext";
import AddProfile from "./Addprofile";

import { setDataForUpwork } from "./Upwork";
import { setDataForFreelancer } from "./Freelancer";
import { PLATFORMS } from "./config";

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

interface TempProfileType {
  label: string;
  value: string;
}

const contentScript = () => {
  const [jdText, setJdText] = useState<string | undefined>(undefined);
  const [isOpen, setIsopen] = useState(false);
  const [errMsg, setErrMsg] = useState<string | undefined>(undefined);
  const [jobTitle, setJobTitle] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<{
    success: boolean;
    loader: boolean;
  }>({
    success: false,
    loader: false,
  });
  const [allProfiles, setAllProfiles] = useState<TempProfileType[] | []>([]);
  const {
    isLoggedin,
    setIsLoggedin,
    profiles,
    addedProfile,
    setAddedProfile,
    setProfiles,
  } = useAuth();
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    prompt: "",
    maxTokens: wordOptions[0].value,
    numResponses: 1,
    toneId: toneOptions[1].value,
    categoryInfoId: "1",
    customToneId: "", //profileid
    additionalInfo: "",
    selectedProfile: allProfiles[0],
    skills: [],
  });

  const hostName = window.location.hostname;

  useEffect(() => {
    if (hostName === "www.upwork.com") {
      setDataForUpwork({
        setJdText,
        setJobTitle,
        setFormData,
        formData,
      });
      setFormData({
        ...formData,
        categoryInfoId: PLATFORMS.UPWORK,
      });
    }

    if (hostName === "www.freelancer.com") {
      setDataForFreelancer({
        setJdText,
        setJobTitle,
        setFormData,
        formData,
      });
      setFormData({
        ...formData,
        categoryInfoId: PLATFORMS.FREELANCER,
      });
    }

    // add event listener to open button
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
    chrome.storage.sync.get("isLoggedin", (result) => {
      setIsLoggedin(result.isLoggedin);
      if (result.isLoggedin) {
        if (profiles?.length) {
          const filteredProfiles = hostName?.includes("upwork")
            ? profiles?.filter(
                (profile: ProfileType) =>
                  profile?.categoryInfoId == PLATFORMS.UPWORK
              )
            : profiles?.filter(
                (profile: ProfileType) =>
                  profile?.categoryInfoId == PLATFORMS.FREELANCER
              );
          const options = filteredProfiles.map((profile: any) => {
            return {
              value: profile.id,
              label: profile.toneDescription.title,
            };
          }) as TempProfileType[];
          setAllProfiles(options);
        }
      } else {
        setAllProfiles([]);
      }
    });
  }, [isLoggedin, profiles]);

  const ToggleSidebar = () => {
    isOpen === true ? setIsopen(false) : setIsopen(true);
  };

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === "isLoggedin") {
        setIsLoggedin(newValue);
        if (newValue === false) {
          setAddedProfile(null);
          setAllProfiles([]);
          setFormData({
            prompt: "",
            maxTokens: wordOptions[0].value,
            numResponses: 1,
            toneId: toneOptions[1].value,
            categoryInfoId: "1",
            customToneId: "", //profileid
            additionalInfo: "",
            selectedProfile: { label: "", value: "" },
            skills: [],
          });
        }
      }
      if (key === "profiles") {
        setProfiles(newValue);
        // const options = newValue.map((profile: ProfileType) => {
        //   return {
        //     value: profile.id,
        //     label: profile.toneDescription.title,
        //   };
        // });
        // setAllProfiles(options);
        const filteredProfiles = hostName?.includes("upwork")
          ? newValue?.filter(
              (profile: ProfileType) =>
                profile?.categoryInfoId == PLATFORMS.UPWORK
            )
          : newValue?.filter(
              (profile: ProfileType) =>
                profile?.categoryInfoId == PLATFORMS.FREELANCER
            );
        console.log("filteredProfiles 1", filteredProfiles);
        const options = filteredProfiles.map((profile: any) => {
          return {
            value: profile.id,
            label: profile.toneDescription.title,
          };
        }) as TempProfileType[];
        setAllProfiles(options);
      }
    }
  });

  const onMouseEnter = (e) => {
    e.stopPropagation();
    const previousEle = document.getElementById(
      `react-select-3-option-${allProfiles.length - 1}`
    );
    previousEle?.classList.remove("css-w19mzl-option");
    previousEle?.classList.add("css-10wo9uf-option");
  };

  const SelectMenuButton = (props) => {
    return (
      <components.MenuList {...props}>
        {props.children}
        <button
          onClick={() => setIsVisible(true)}
          className="cstm__selectbtn"
          onMouseOver={onMouseEnter}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9233 11.2922C12.3487 11.0637 12.8356 10.9336 13.3541 10.9336H13.3559C13.4086 10.9336 13.4332 10.8703 13.3946 10.8352C12.8553 10.3512 12.2393 9.96031 11.5717 9.67852C11.5647 9.675 11.5577 9.67324 11.5506 9.66973C12.6422 8.87695 13.3524 7.58848 13.3524 6.13477C13.3524 3.72656 11.4047 1.77539 9.0018 1.77539C6.59887 1.77539 4.65297 3.72656 4.65297 6.13477C4.65297 7.58848 5.36313 8.87695 6.45649 9.66973C6.44946 9.67324 6.44243 9.675 6.4354 9.67852C5.64965 10.0107 4.94477 10.4871 4.33833 11.0953C3.73538 11.6972 3.25536 12.4106 2.92504 13.1959C2.60005 13.9649 2.42465 14.7888 2.40825 15.6234C2.40778 15.6422 2.41107 15.6609 2.41793 15.6783C2.42478 15.6958 2.43507 15.7117 2.44817 15.7252C2.46128 15.7386 2.47694 15.7493 2.49423 15.7565C2.51153 15.7638 2.53011 15.7676 2.54887 15.7676H3.6018C3.67739 15.7676 3.74067 15.7061 3.74243 15.6305C3.77758 14.2734 4.32075 13.0025 5.28227 12.0393C6.27543 11.0426 7.59731 10.4941 9.00356 10.4941C10.0002 10.4941 10.9565 10.7701 11.7809 11.2869C11.8021 11.3002 11.8264 11.3077 11.8514 11.3086C11.8764 11.3096 11.9012 11.3039 11.9233 11.2922V11.2922ZM9.00356 9.1582C8.19848 9.1582 7.44086 8.84355 6.86958 8.27227C6.58849 7.99191 6.36566 7.65871 6.21391 7.29186C6.06216 6.92501 5.9845 6.53176 5.9854 6.13477C5.9854 5.32793 6.30004 4.56855 6.86958 3.99727C7.43911 3.42598 8.19672 3.11133 9.00356 3.11133C9.8104 3.11133 10.5663 3.42598 11.1375 3.99727C11.4186 4.27762 11.6415 4.61082 11.7932 4.97767C11.945 5.34452 12.0226 5.73777 12.0217 6.13477C12.0217 6.9416 11.7071 7.70098 11.1375 8.27227C10.5663 8.84355 9.80864 9.1582 9.00356 9.1582ZM15.4688 13.3418H13.9922V11.8652C13.9922 11.7879 13.929 11.7246 13.8516 11.7246H12.8672C12.7899 11.7246 12.7266 11.7879 12.7266 11.8652V13.3418H11.25C11.1727 13.3418 11.1094 13.4051 11.1094 13.4824V14.4668C11.1094 14.5441 11.1727 14.6074 11.25 14.6074H12.7266V16.084C12.7266 16.1613 12.7899 16.2246 12.8672 16.2246H13.8516C13.929 16.2246 13.9922 16.1613 13.9922 16.084V14.6074H15.4688C15.5461 14.6074 15.6094 14.5441 15.6094 14.4668V13.4824C15.6094 13.4051 15.5461 13.3418 15.4688 13.3418Z"
              fill="#7F56D9"
            />
          </svg>
          <span
            style={{
              paddingTop: "2px",
              marginLeft: "4px",
            }}
          >
            Create New Profile
          </span>
        </button>
      </components.MenuList>
    );
  };

  const fillDetails = () => {
    let textArea;

    if (hostName === "www.upwork.com") {
      textArea = document.querySelector<HTMLElement>(".up-textarea");
    }
    if (hostName === "www.freelancer.com") {
      textArea = document.getElementById("descriptionTextArea");
    }
    const fillResponse = generatedResponse.replace(/\s+/g, " ");
    textArea.value = fillResponse;
    textArea.dispatchEvent(new Event("input", { bubbles: true }));

    toast.success("Cover letter filled");
  };

  const handleSubmit = () => {
    setAddedProfile(null);
    setGeneratedResponse(null);
    if (!isLoggedin) {
      return toast.error("Please login to use this feature");
    }

    if (profiles.length === 0) {
      return toast.error("Please create a profile to use this feature");
    }
    if (!formData.customToneId) {
      return toast.error("Please select a profile");
    }
    setIsGenerating({
      success: false,
      loader: true,
    });
    setErrMsg("");
    const promptData = {
      prompt: {
        description: formData.prompt,
        skills: formData.skills,
      },
      maxTokens: formData.maxTokens,
      numResponses: formData.numResponses,
      toneId: formData.toneId,
      categoryInfoId: formData.categoryInfoId,
      customToneId: formData.customToneId, //profileid
      additionalInfo: formData.additionalInfo,
      meta: {
        source: formData.categoryInfoId,
        description: jobTitle,
      },
    };

    var port = chrome.runtime.connect({ name: "vakya" });
    port.postMessage({ type: "getStreamPrompt", promptData: promptData });
    port.onMessage.addListener((msg) => {
      if (msg.data) {
        setGeneratedResponse((prev) => {
          if (prev) {
            return prev + msg.data;
          } else {
            return msg.data;
          }
        });
        setIsGenerating({
          success: true,
          loader: false,
        });
      } else {
        // toast.error("Something went wrong please try again");
        // setIsGenerating({
        //   success: false,
        //   loader: false,
        // });
      }
      // if (msg.message === "done") {
      // }
    });

    // chrome.runtime.sendMessage(
    //   { type: "getPrompt", promptData: promptData },
    //   (response) => {
    //     console.log("response", response.data);
    //     if (response?.data?.length) {
    //       const resText = response.data[0];
    //       console.log("res text", resText);
    //       setGeneratedResponse(response.data);
    //       setIsGenerating({
    //         success: true,
    //         loader: false,
    //       });
    //     } else {
    //       toast.error("Something went wrong please try again");
    //       setIsGenerating({
    //         success: false,
    //         loader: false,
    //       });
    //     }
    //   }
    // );
  };

  const filteredProfiles = hostName?.includes("upwork")
    ? profiles?.filter(
        (profile: ProfileType) => profile?.categoryInfoId == PLATFORMS.UPWORK
      )
    : profiles?.filter(
        (profile: ProfileType) =>
          profile?.categoryInfoId == PLATFORMS.FREELANCER
      );

  const defaultProfile =
    filteredProfiles?.length > 0 &&
    filteredProfiles.find((profile: ProfileType) => profile?.default === true);

  useEffect(() => {
    if (addedProfile) {
      setFormData((prev) => ({
        ...prev,
        customToneId: addedProfile?.value,
        selectedProfile: addedProfile,
      }));
      // setAddedProfile(null);
    }
    if (!addedProfile && defaultProfile) {
      setFormData((prev) => ({
        ...prev,
        customToneId: defaultProfile?.id,
        selectedProfile: allProfiles?.filter(
          (profile: { value: string }) => profile?.value === defaultProfile?.id
        )[0],
      }));
    }
  }, [addedProfile, allProfiles, defaultProfile, isLoggedin]);

  // const [textArHeight, setTextArHeight] = useState(7);

  // console.log("textArHeight", textArHeight);

  return (
    <>
      <Toaster position="top-center" />
      <div className="container-fluid">
        <div
          style={{
            zIndex: 99999,
          }}
          className={`sidebar ${isOpen == true ? "active" : ""}`}
        >
          {!isLoggedin ? (
            <Login isContentScript={true} />
          ) : !isVisible && isOpen ? (
            <div
              // className="p-4"
              style={{
                padding: "1rem",
              }}
            >
              <div
                // className="flex items-center justify-between "
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={chrome.runtime.getURL("logoDark.svg")}
                  alt="logo"
                  // className="w-24"
                  style={{
                    width: "96px",
                  }}
                />
                <button
                  onClick={() => {
                    window.open("https://test.vakya.ai/", "_blank");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                >
                  <img
                    src={chrome.runtime.getURL("home2.svg")}
                    alt="logo"
                    // className="w-5"
                    style={{
                      width: "20px",
                    }}
                  />
                </button>
              </div>
              <p className="main__title69">Smart AI Cover Letter Writer</p>

              <div className="jd__div69">
                <span className="jd__heading69">Job Title:</span>
                <p className="jd__title69">{jobTitle}</p>
              </div>
              <div
                className="selProfileDiv"
                style={{
                  marginTop: "1.1rem",
                }}
              >
                <div>
                  <p className="cmn__txtCol">Select Profile</p>
                  <Select
                    className="width__cls69"
                    options={allProfiles}
                    value={formData.selectedProfile}
                    placeholder="Select Profile"
                    maxMenuHeight={150}
                    components={{
                      MenuList: SelectMenuButton,
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: "1px solid #e2e8f0",
                        "&:focus": {
                          boxShadow: "none",
                          outline: "none",
                        },
                        "&:hover": {
                          border: "1px solid #e2e8f0",
                        },
                        height: "40px",
                        fontSize: "14px",
                      }),
                      indicatorSeparator: (state) => ({
                        display: "none",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        fontSize: "14px",
                      }),
                    }}
                    theme={(theme) => {
                      return {
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: "#7F56D9",
                          primary25: "#ECE3FF",
                        },
                      };
                    }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        selectedProfile: e,
                        customToneId: e.value,
                      })
                    }
                    // don't hover on last option
                  />
                </div>
                <div className="div__parentHorizontal69">
                  <div className="width__half69">
                    <p className="cmn__txtCol">Tone</p>
                    <Select
                      options={toneOptions}
                      placeholder="Select Tone"
                      defaultValue={toneOptions[0]}
                      className="width__cls69"
                      onChange={(e) =>
                        setFormData({ ...formData, toneId: e.value })
                      }
                      maxMenuHeight={150}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          border: "1px solid #e2e8f0",
                          "&:focus": {
                            boxShadow: "none",
                            outline: "none",
                          },
                          "&:hover": {
                            border: "1px solid #e2e8f0",
                          },
                          height: "40px",
                          fontSize: "14px",
                        }),
                        indicatorSeparator: (state) => ({
                          display: "none",
                        }),
                      }}
                      theme={(theme) => {
                        return {
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: "#7F56D9",
                            primary25: "#ECE3FF",
                          },
                        };
                      }}
                    />
                  </div>
                  <div className="width__half69">
                    <p className="cmn__txtCol">Word Limit</p>
                    <Select
                      options={wordOptions}
                      placeholder="Select Words Count"
                      defaultValue={wordOptions[0]}
                      className="width__cls69"
                      onChange={(e) =>
                        setFormData({ ...formData, maxTokens: e.value })
                      }
                      maxMenuHeight={150}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          border: "1px solid #e2e8f0",
                          "&:focus": {
                            boxShadow: "none",
                            outline: "none",
                          },
                          "&:hover": {
                            border: "1px solid #e2e8f0",
                          },
                          height: "40px",
                          fontSize: "14px",
                        }),
                        indicatorSeparator: (state) => ({
                          display: "none",
                        }),
                      }}
                      theme={(theme) => {
                        return {
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: "#7F56D9",
                            primary25: "#ECE3FF",
                          },
                        };
                      }}
                    />
                  </div>
                </div>
                <textarea
                  className="addition__infoInp9"
                  placeholder="Additional Information"
                  rows={2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalInfo: e.target.value,
                    })
                  }
                ></textarea>

                {isGenerating.loader ? (
                  <div className="lottie__div69">
                    <Lottie
                      animationData={GenerateAnimation}
                      loop={true}
                      className="w-44"
                    />
                    <p className="txt__primary">Generating</p>
                  </div>
                ) : isGenerating.success ? (
                  <div>
                    <p className="txt__primary">Cover Letter Generated</p>
                    <div className="result__txtAreaParent">
                      <textarea
                        className="result__txtArea"
                        value={
                          //remove /n from generated response
                          generatedResponse?.replace(/(\r\n|\n|\r)/gm, " ")
                        }
                        rows={7}
                        onChange={(e) => {
                          setGeneratedResponse(e.target.value);
                        }}
                      ></textarea>
                      {/* <Typewriter
                        options={{
                          cursor: "",
                          delay: 20,
                        }}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(
                              generatedResponse?.replace(/(\r\n|\n|\r)/gm, " ")
                            )
                            .deleteChars(1)

                            .start();
                        }}
                      /> */}
                      <div
                        // className="flex justify-between p-2"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px",
                        }}
                      >
                        <button
                          onClick={() => {
                            handleSubmit();
                          }}
                          className="cmn__cls3"
                          // style={{
                          //   width: "14px",
                          // }}
                        >
                          <img
                            src={chrome.runtime.getURL("regenerate.svg")}
                            alt="regen"
                            // className="w-5 mr-1"
                            style={{
                              width: "20px",
                              marginRight: "4px",
                            }}
                          />
                          <span className="pt-[1px]">Regenerate Response</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              generatedResponse?.replace(/(\r\n|\n|\r)/gm, " ")
                            ),
                              toast.success("Copied to clipboard");
                          }}
                          className="cmn__cls3"
                        >
                          <img
                            src={chrome.runtime.getURL("copy.svg")}
                            alt="copy"
                            // className="w-6"
                            style={{
                              width: "24px",
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>{errMsg}</p>
                )}

                {errMsg && <p>{errMsg}</p>}
              </div>
              <div className="sb_btm69">
                <button
                  className={`cancel__btn69 ${
                    isGenerating.loader ? "cursor__cls69" : ""
                  }`}
                  onClick={ToggleSidebar}
                  disabled={isGenerating.loader}
                >
                  Cancel
                </button>
                {isGenerating.success ? (
                  <button
                    disabled={isGenerating.loader}
                    onClick={fillDetails}
                    className="generate__btn69"
                  >
                    Fill
                  </button>
                ) : (
                  <button
                    disabled={isGenerating.loader}
                    onClick={handleSubmit}
                    className="generate__btn69"
                  >
                    {isGenerating.loader ? "Generating..." : "Generate"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <AddProfile setIsVisible={setIsVisible} />
          )}
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
