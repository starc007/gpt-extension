function init() {
  console.log("init");
  const appContainer = document.createElement("div");
  appContainer.style.position = "relative";
  const textArea = document.querySelector(
    "[aria-labelledby='cover_letter_label']"
  );
  const parentEle = textArea?.parentElement;
  parentEle?.insertBefore(appContainer, textArea);
  parentEle?.removeChild(textArea);
  appContainer.appendChild(textArea);

  const button = document.createElement("button");
  const img = document.createElement("img");
  img.style.width = "20px";
  img.style.height = "20px";
  img.src =
    "https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/60/null/external-astronaut-space-vitaliy-gorbachev-lineal-color-vitaly-gorbachev-4.png";
  button.appendChild(img);

  button.style.position = "absolute";
  button.style.bottom = "14px";
  button.style.left = "13px";
  button.style.width = "20px";
  button.style.height = "20px";
  button.style.borderRadius = "50%";
  button.style.backgroundColor = "none";
  button.style.border = "none";
  button.style.outline = "none";
  button.style.cursor = "pointer";
  button.style.zIndex = "9999";

  appContainer.insertAdjacentElement("afterbegin", button);
}

setTimeout(() => {
  init();
}, 3000);
