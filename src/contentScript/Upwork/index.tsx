import { PLATFORMS } from "../config";

export const TextAreaContainer = () => {
  const textArea = document.querySelector(
    "[aria-labelledby='cover_letter_label']"
  );
  const url = chrome.runtime.getURL("icon.png");
  const parentEle = textArea?.parentElement;
  parentEle?.setAttribute("style", "position: relative");
  const button = document.createElement("button");
  button.id = "littleIcn69";
  button.setAttribute(
    "style",
    "position: absolute; bottom: 11px; left: 11px; background: none; border: none; outline: none; cursor: pointer;"
  );
  const img = document.createElement("img");
  img.setAttribute("style", "width: 20px; height: 20px;");
  img.src = url;
  button.appendChild(img);
  parentEle?.appendChild(button);
};

export const LabelAddContainer = () => {
  const appContainer = document.createElement("div");
  appContainer.innerHTML =
    "<button id='ctOpen69'><span style='color:#7F56D9'>Use Vakya</span> for writing Cover letter through AI</button>";
  appContainer.id = "ctn69";

  const css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML =
    "#ctn69 { display: flex; justify-content: space-between; align-items: center; } #ctOpen69 { color: #000; margin:0; white-space: nowrap}";

  const label = document.getElementById("cover_letter_label");
  const parentEle = label?.parentElement;
  parentEle?.insertBefore(appContainer, label);
  parentEle?.removeChild(label);
  appContainer.insertBefore(label, appContainer.firstChild);

  appContainer.appendChild(css);
};

interface FormdataProps {
  prompt: string;
  maxTokens: number;
  numResponses: number;
  toneId: number;
  categoryInfoId: string;
  customToneId: string;
  additionalInfo: string;
  skills: string[];
  selectedProfile: {
    label: string;
    value: string;
  };
}

interface SetDataProps {
  setJobTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  setJdText: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFormData: React.Dispatch<React.SetStateAction<FormdataProps>>;
  formData: FormdataProps;
}

export const setDataForUpwork = ({
  setJobTitle,
  setJdText,
  setFormData,
  formData,
}: SetDataProps) => {
  const title = document.querySelector<HTMLElement>(".content");
  const titleText = title?.firstChild?.textContent;
  setJobTitle(titleText);

  const JD = document.getElementById("up-truncation-1");
  const sibling = JD?.nextElementSibling;
  const siblingStyle = window.getComputedStyle(sibling);
  const siblingDisplay = siblingStyle.getPropertyValue("display");

  const skills = document.querySelectorAll(".up-skill-badge");
  const skillsArr: string[] = [];
  skills.forEach((skill) => {
    skillsArr.push(skill.textContent?.replace(/\s+/g, " ").trim() || "");
  });
  setFormData({ ...formData, skills: skillsArr });

  if (siblingDisplay === "none") {
    const JDText = JD?.innerText;
    setJdText(JDText);
    setFormData({
      ...formData,
      prompt: JDText,
      categoryInfoId: PLATFORMS.UPWORK,
    });
  }

  const siblingBtn = sibling?.querySelector("button");
  //click the button
  siblingBtn?.click();
  const parent = document.querySelector<HTMLElement>(".up-truncation");

  const interval = setInterval(() => {
    if (parent?.classList.contains("is-expanded")) {
      const JDText = JD?.innerText;
      setJdText(JDText);
      setFormData({
        ...formData,
        prompt: JDText,
        categoryInfoId: PLATFORMS.UPWORK,
      });
      clearInterval(interval);
    }
  }, 300);
};
