const BASE_URL = "https://api.vakya.ai";
const UPWORK_ID = 1;

export interface UserType {
  email: string;
  name: string;
  picture: string;
  userId: string;
}

export interface Datatype {
  title: string;
  skills: string;
  experience: string;
  portfolioLink: string;
  name: string;
  clients: string;
}
export interface ProfileType {
  toneDescription: Datatype;
  id: string;
  categoryInfoId: string;
  updatedAt: string;
  createdAt: string;
  userId: string;
}

export const fetchProfiles = async (
  setProfiles: React.Dispatch<React.SetStateAction<ProfileType[] | []>>
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/user/getUserCustomTones?categoryID=${UPWORK_ID}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data.headers.success) {
      setProfiles(data.body);
    } else {
      setProfiles([]);
    }
  } catch (err) {
    console.log("err", err);
    setProfiles([]);
  }
};

export const fetchUser = async (
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>,
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/login/success`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (data.headers.success === "0") {
      setUser(null);
      setIsLoggedin(false);
    } else {
      const user = {
        name: data?.body?.body?.displayName,
        email: data?.body?.body?.email,
        userId: data?.body?.userId,
        picture: data?.body?.body?.picture,
      };
      setUser(user);
      setIsLoggedin(true);
    }
  } catch (err) {
    console.log("err", err);
    setUser(null);
    setIsLoggedin(false);
  }
};

export const __addProfile = async (
  formData: Datatype,
  setProfiles: React.Dispatch<React.SetStateAction<ProfileType[] | []>>
) => {
  try {
    const filldata = {
      toneDescription: formData,
      categoryID: UPWORK_ID,
    };
    const res = await fetch(`${BASE_URL}/api/v1/user/createUserCustomeTones`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filldata),
    });
    const data = await res.json();
    if (data.headers.success) {
      setProfiles((prev) => [data.body, ...prev]);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

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
  formData: Datatype,
  editData: ProfileType
) => {
  try {
    const filldata = {
      toneDescription: formData,
      categoryID: editData.categoryInfoId,
      id: editData.id,
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

export const __logout = async (
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>
) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/login/logout`, {
      method: "GET",
      credentials: "include",
    });
    await res.json();
    chrome.cookies.remove(
      { url: "https://api.vakya.ai", name: "connect.sid" },
      function (cookie) {
        setIsLoggedin(false);
        setUser(null);
      }
    );
  } catch (err) {
    console.log("err", err);
    setIsLoggedin(false);
    setUser(null);
  }
};
