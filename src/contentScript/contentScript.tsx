import React, { useEffect, useState } from "react";
import Select from "react-select";
import { fetchProfiles, fetchUser, ProfileType, UserType } from "../api";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const toneOptions = [
  {
    value: "1",
    label: "Informal",
  },
  {
    value: "3",
    label: "Neutral",
  },
  {
    value: "3",
    label: "Formal",
  },
  {
    value: "4",
    label: "Friendly",
  },
  {
    value: "5",
    label: "Sarcastic",
  },
  {
    value: "6",
    label: "Confident",
  },
  {
    value: "7",
    label: "Optimistic",
  },
  {
    value: "8",
    label: "Knowledgeable",
  },
];

const wordOptions = [
  {
    value: "50",
    label: "Approx 50 words",
  },
  {
    value: "100",
    label: "Approx 100 words",
  },
  {
    value: "150",
    label: "Approx 150 words",
  },
  {
    value: "200",
    label: "Approx 200 words",
  },
];

const profileData = [
  {
    id: 1,
    name: "Profile 1",
  },
];

const contentScript = () => {
  const [jdText, setJdText] = useState<string | undefined>(undefined);
  const [isOpen, setIsopen] = useState(false);
  const [profiles, setProfiles] = useState<ProfileType[] | []>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    // chrome.cookies.get(
    //   { url: "https://api.vakya.ai", name: "connect.sid" },
    //   function (cookie) {
    //     if (cookie) {
    //       fetchUser(setUser, setIsLoggedin);
    //     }
    //   }
    // );
    console.log("content script");

    chrome.runtime
      .sendMessage({
        message: "setCookie",
      })
      .then((res) => {
        console.log("res", res);
      });

    const JD = document.getElementById("up-truncation-1");
    const JDText = JD?.innerText;
    setJdText(JDText);
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
      fetchUser(setUser, setIsLoggedin);
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
    const text = " hello world";
    textArea.innerText = text;
  };

  console.log("profiles", user);

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
              <p
                style={{
                  maxWidth: "350px",
                  color: "#939393",
                  marginTop: "-14px",
                }}
              >
                UpCat - the smart way to stand out from the competition on
                Upwork with a little help from your furry companion.
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
              options={options}
              placeholder="Select Profile"
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
              }}
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
              />
              <Select
                options={wordOptions}
                placeholder="Select Words Count"
                defaultValue={toneOptions[1]}
                className="select__width69"
              />
            </div>
            <textarea
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                width: "100%",
                padding: "1rem",
              }}
              placeholder="Additional Information"
              rows={3}
            ></textarea>
          </div>

          <p>
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              Job Description:
            </span>{" "}
            {jdText}
          </p>
          <div className="bottom__btn69">
            <button className="fill__btn69" onClick={fillDetails}>
              Fill
            </button>
            <button className="generate__btn69">Generate</button>
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
