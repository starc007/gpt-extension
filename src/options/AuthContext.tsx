import React, { useContext, useState, createContext, useEffect } from "react";
import {
  ProfileType,
  UserType,
  Datatype,
  __logout,
  __deleteProfile,
  __updateProfile,
} from "../api";

interface AuthContextType {
  isLoggedin: boolean;
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  profiles: ProfileType[] | [];
  setProfiles: React.Dispatch<React.SetStateAction<ProfileType[] | []>>;
  logout: () => Promise<void>;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  AddProfile: (data: Datatype) => Promise<void>;
  UpdateProfile: (data: Datatype, editData: ProfileType) => Promise<void>;
  isAddProfileModalOpen: boolean;
  setIsAddProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: Datatype;
  setFormData: React.Dispatch<React.SetStateAction<Datatype>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteProfileModalOpen: boolean;
  setIsDeleteProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  DeleteProfile: (id: string) => Promise<void>;
  editData: ProfileType | null;
  setEditData: React.Dispatch<React.SetStateAction<ProfileType | null>>;
}

const AuthContext = createContext({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [profiles, setProfiles] = useState<ProfileType[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] =
    useState<boolean>(false);

  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] =
    useState<boolean>(false);

  const [editData, setEditData] = useState<ProfileType | null>(null);

  const [formData, setFormData] = useState<Datatype>({
    title: "",
    skills: [],
    bio: "",
  });

  useEffect(() => {
    chrome.storage.sync.get("isLoggedin", async (res) => {
      if (res.isLoggedin) {
        setIsLoggedin(true);
        setLoading(true);
        chrome.runtime
          .sendMessage({
            type: "getUser",
          })
          .then((res) => {
            if (res) {
              setUser(res.data);
              setIsLoggedin(true);
              chrome.runtime
                .sendMessage({
                  type: "fetchProfiles",
                })
                .then((res) => {
                  setProfiles(res.profiles);
                  setLoading(false);
                });
            }
          });
      }
    });
  }, [isLoggedin]);

  const logout = async () => {
    const res = await __logout();
    if (res) {
      setIsLoggedin(false);
      setUser(null);
      setProfiles([]);
      chrome.storage.sync.set({ isLoggedin: false });
    }
  };

  const AddProfile = async (data: Datatype) => {
    const skills = data.skills.map((skill) => skill.label);
    const body = {
      title: data.title,
      skills: skills,
      bio: data.bio,
    };

    // const res = await __addProfile(body);
    // if (res) {
    //   setProfiles((prev) => [res, ...prev]);
    //   setIsAddProfileModalOpen(false);
    //   setFormData({
    //     title: "",
    //     skills: [],
    //     bio: "",
    //   });
    // }
    chrome.runtime
      .sendMessage({
        type: "saveProfile",
        profileData: body,
      })
      .then((res) => {
        if (res) {
          setProfiles((prev) => [res.data, ...prev]);
          setIsAddProfileModalOpen(false);
          setFormData({
            title: "",
            skills: [],
            bio: "",
          });
        }
      });
  };

  const UpdateProfile = async (data: Datatype, editData: ProfileType) => {
    const skills = data.skills.map((skill) => skill.label);
    const body = {
      title: data.title,
      skills: skills,
      bio: data.bio,
    };
    const res = await __updateProfile(body, editData);
    if (res) {
      // fetchProfiles().then((res) => {
      //   setProfiles(res);
      //   setIsAddProfileModalOpen(false);
      // });
      chrome.runtime
        .sendMessage({
          type: "fetchProfiles",
        })
        .then((res) => {
          setProfiles(res.profiles);
          setIsAddProfileModalOpen(false);
        });
    }
  };

  const DeleteProfile = async (id: string) => {
    const res = await __deleteProfile(id);
    if (res) {
      setProfiles((prev) =>
        prev.filter((profile: ProfileType) => profile.id !== id)
      );
      setIsDeleteProfileModalOpen(false);
    }
  };

  const value = {
    isLoggedin,
    setIsLoggedin,
    user,
    setUser,
    profiles,
    setProfiles,
    logout,
    isSidebarOpen,
    setIsSidebarOpen,
    AddProfile,
    UpdateProfile,
    isAddProfileModalOpen,
    setIsAddProfileModalOpen,
    formData,
    setFormData,
    loading,
    setLoading,
    isDeleteProfileModalOpen,
    setIsDeleteProfileModalOpen,
    DeleteProfile,
    editData,
    setEditData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
