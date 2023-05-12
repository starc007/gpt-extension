import { PLATFORMS } from "../config";

export const TextAreaContainer = () => {
  const url = chrome.runtime.getURL("icon.png");
  const textArea = document.getElementById("descriptionTextArea");
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
  const labelElement = document.querySelector(".BidHeader");
  const label = labelElement?.getElementsByTagName("fl-label")[0];
  label?.setAttribute(
    "style",
    "display: flex; justify-content: space-between; align-items: center;flex-wrap:wrap; width: 100%;"
  );
  // create button
  const button = document.createElement("button");
  button.id = "ctOpen69";
  button.setAttribute(
    "style",
    "color: #000; margin:0; white-space: nowrap; background: none; border: none; outline: none; cursor: pointer; font-size: 14px; font-weight: 500;"
  );

  const span = document.createElement("span");
  span.setAttribute("style", "color:#7F56D9");
  span.innerText = "Use Vakya";
  button.appendChild(span);
  const span2 = document.createElement("span");
  span2.innerText = " for writing Cover letter through AI";
  button.appendChild(span2);

  label?.appendChild(button);
};

interface FormdataProps {
  prompt: string;
  maxTokens: number;
  numResponses: number;
  toneId: number;
  skills: string[];
  categoryInfoId: string;
  customToneId: string;
  additionalInfo: string;
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

export const setDataForFreelancer = ({
  setJobTitle,
  setJdText,
  setFormData,
  formData,
}: SetDataProps) => {
  // job title
  const appProjectEl = document.getElementsByTagName("app-project-title")[0];
  const jobTitleText = appProjectEl.getElementsByTagName("fl-text")[0];
  const title = jobTitleText.getElementsByTagName("span")[0].innerText;
  setJobTitle(title);

  // job description
  const appProjectDescEl = document.getElementsByTagName(
    "app-project-details-description"
  )[0];
  const jobDescText = appProjectDescEl.getElementsByTagName("fl-text")[0];
  const desc = jobDescText.getElementsByTagName("span")[0].innerText;
  setJdText(desc);

  //skills find atrribute fltrackinglabel="ProjectSkillTag"
  const skillsEl = document.querySelectorAll(
    '[fltrackinglabel="ProjectSkillTag"]'
  );
  const skills = Array.from(skillsEl).map((el) => el.textContent);
  //   remove duplicates and spaces
  const uniqueSkills = [...new Set(skills)].map((el) => el?.trim());

  setFormData({
    ...formData,
    prompt: desc,
    categoryInfoId: PLATFORMS.FREELANCER,
    skills: uniqueSkills,
  });
};
