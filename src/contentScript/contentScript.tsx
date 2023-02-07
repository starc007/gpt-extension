import React, { useEffect, useState } from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const contentScript = () => {
  const [jdText, setJdText] = useState<string | undefined>(undefined);

  useEffect(() => {
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

  const [isOpen, setIsopen] = useState(false);
  const ToggleSidebar = () => {
    isOpen === true ? setIsopen(false) : setIsopen(true);
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
                options={options}
                placeholder="Select Tone"
                defaultValue={options[0]}
                className="select__width69"
              />
              <Select
                options={options}
                placeholder="Select Words Count"
                defaultValue={options[1]}
                className="select__width69"
              />
            </div>
            <textarea
              // className="border p-4 rounded-lg w-full"
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
          <button className="generate__btn">Generate</button>
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
