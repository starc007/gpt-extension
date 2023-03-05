const BASE_URL = "https://api.vakya.ai";
const UPWORK_ID = 1;

export interface UserType {
  email: string;
  name: string;
  picture: string;
  userId: string;
}

type SkillType = {
  value: string;
  label: string;
};

export interface Datatype {
  title: string;
  skills: readonly SkillType[];
  bio: string;
  default?: boolean;
}

export interface SubmitProfileType {
  title: string;
  skills: string[];
  bio: string;
}
export interface ProfileType {
  toneDescription: SubmitProfileType;
  id: string;
  categoryInfoId: string;
  updatedAt: string;
  createdAt: string;
  userId: string;
  default?: boolean;
}

export const __deleteProfile = async (id: string) => {
  try {
    const send = {
      id,
    };
    const res = await fetch(`${BASE_URL}/api/v1/user/deleteUserCustomTones`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(send),
    });
    const data = await res.json();
    if (data.headers.success) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("err", err);
    return false;
  }
};

export const __updateProfile = async (
  formData: SubmitProfileType,
  editData: ProfileType,
  defaultChecked: boolean
) => {
  try {
    const filldata = {
      toneDescription: formData,
      categoryID: editData.categoryInfoId,
      id: editData.id,
      default: defaultChecked ? 1 : 0,
    };
    const res = await fetch(`${BASE_URL}/api/v1/user/updateUserCustomTones`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filldata),
    });
    const data = await res.json();
    if (data.headers.success) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const __logout = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/login/logout`, {
      method: "GET",
      credentials: "include",
    });
    await res.json();
    chrome.cookies.remove(
      { url: "https://api.vakya.ai", name: "connect.sid" },
      function (cookie) {
        console.log("cookie removed");
      }
    );
    return true;
  } catch (err) {
    console.log("err", err);
    return false;
  }
};
