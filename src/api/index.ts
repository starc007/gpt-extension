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
}

// export const fetchProfiles = async () => {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/api/v1/user/getUserCustomTones?categoryID=${UPWORK_ID}`,
//       {
//         method: "GET",
//         credentials: "include",
//       }
//     );
//     const data = await res.json();
//     if (data.headers.success) {
//       return data.body;
//     } else {
//       return [];
//     }
//   } catch (err) {
//     console.log("err", err);
//     return [];
//   }
// };

// export const fetchUser = async () => {
//   try {
//     const res = await fetch(`${BASE_URL}/api/v1/login/success`, {
//       method: "GET",
//       credentials: "include",
//     });

//     const data = await res.json();
//     if (data.headers.success === 1) {
//       const user = {
//         name: data?.body?.body?.displayName,
//         email: data?.body?.body?.email,
//         userId: data?.body?.userId,
//         picture: data?.body?.body?.picture,
//       };
//       return user;
//     } else {
//       return null;
//     }
//   } catch (err) {
//     console.log("err", err);
//     return null;
//   }
// };

// export const __addProfile = async (formData: SubmitProfileType) => {
//   try {
//     const filldata = {
//       toneDescription: formData,
//       categoryID: UPWORK_ID,
//     };
//     const res = await fetch(`${BASE_URL}/api/v1/user/createUserCustomeTones`, {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(filldata),
//     });
//     const data = await res.json();
//     if (data.headers.success) {
//       return data.body;
//     } else {
//       return [];
//     }
//   } catch (err) {
//     console.log(err);
//     return [];
//   }
// };

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
