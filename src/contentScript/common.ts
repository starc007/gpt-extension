import { PLATFORMS } from "./config";

export function addLoading(isLinkedIn: boolean) {
  const func = (buttons) => {
    if (!buttons) {
      return null;
    }

    buttons.style.opacity = 0.6;
    buttons.style.pointerEvents = "none";
  };

  if (isLinkedIn) {
    const commentButtons = document.querySelectorAll(
      "form.comments-comment-box__form"
    );
    commentButtons.forEach((commentButton) => {
      const buttons = commentButton.querySelector(".vakyaCommentBtn69");
      func(buttons);
    });
  } else {
    const buttons = document.getElementById("vakyaCommentBtn69");
    func(buttons);
  }
}

export function removeLoading(isLinkedIn: boolean) {
  const func = (buttons) => {
    if (!buttons) {
      return null;
    }

    buttons.style.opacity = 1;
    buttons.style.pointerEvents = "auto";
  };

  if (isLinkedIn) {
    const commentButtons = document.querySelectorAll(
      "form.comments-comment-box__form"
    );
    commentButtons.forEach((commentButton) => {
      const buttons = commentButton.querySelector(".vakyaCommentBtn69");
      func(buttons);
    });
  } else {
    const buttons = document.getElementById("vakyaBtn69");
    func(buttons);
  }
}
