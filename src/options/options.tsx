import React, { useEffect, useState } from "react";
import AddProfileModal from "./AddProfileModal";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchProfiles,
  fetchUser,
  ProfileType,
  UserType,
  __logout,
  __deleteProfile,
} from "../api";

const Options = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedin, setIsLoggedin] = useState(false);

  const [profiles, setProfiles] = useState<ProfileType[] | []>([]);
  const [editData, setEditData] = useState<ProfileType | null>(null);

  useEffect(() => {
    chrome.cookies.get(
      { url: "https://api.vakya.ai", name: "connect.sid" },
      function (cookie) {
        if (cookie) {
          fetchUser(setUser, setIsLoggedin);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (isLoggedin && user) {
      fetchProfiles(setProfiles);
    }
  }, [isLoggedin]);

  const handleLogin = async () => {
    chrome.runtime
      .sendMessage({
        message: "googleLogin",
      })
      .then((res) => {
        console.log("res", res);
      });
  };

  const handleDelete = async (id: string) => {
    const res = await __deleteProfile(id);
    if (res) {
      toast.success("Profile deleted successfully");
      fetchProfiles(setProfiles);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Toaster
        toastOptions={{
          className: "!border-gray-300 border !shadow-2xl",
        }}
        position="top-right"
      />
      <div className="container mx-auto md:px-0 px-4">
        <div className="flex items-center justify-between h-16 border-b w-full">
          <p className="text-2xl font-bold">Chat GPT</p>
        </div>
        <div className="flex lg:flex-row flex-col lg:space-x-6 space-y-4 lg:space-y-0 mt-4">
          <div className="lg:w-60 w-full lg:h-72 h-16 bg-gray-100 rounded sticky top-4"></div>
          <section className="w-full overflow-y-auto space-y-4">
            {!isLoggedin ? (
              <div className="flex flex-col w-full rounded bg-gray-100 lg:p-6 md:p-5 p-4">
                <p className="text-3xl font-bold text-gray-700">Login/Signup</p>
                <p className="mt-2 text-gray-600 text-sm">
                  Open Your Free Account
                </p>
                <button
                  onClick={handleLogin}
                  className="w-40 h-11 rounded-md bg-primary text-white text-sm mt-5"
                >
                  Login with google
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-5 w-full rounded bg-gray-100 lg:p-6 p-4">
                <img src={user.picture} className="w-28 h-28 rounded-full" />
                <div className="flex flex-col">
                  <p className="mt-2 text-gray-600 text-base font-semibold">
                    {user.name}
                  </p>
                  <p className="mt-2 text-gray-600 text-xs">{user.email}</p>
                  <button
                    onClick={() => {
                      __logout(setIsLoggedin, setUser);
                    }}
                    className="w-24 h-10 rounded-md bg-primary text-white text-sm mt-5"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
            {isLoggedin && (
              <div className="flex flex-col w-full rounded bg-gray-100 lg:px-6 px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-700">
                    All Profiles
                  </p>
                  <button
                    onClick={() => {
                      setEditData(null);
                      setIsOpen(true);
                    }}
                    className="w-24 h-10 rounded-md bg-primary text-white text-sm"
                  >
                    Add Profile
                  </button>
                </div>

                <div className="flex flex-col mt-4 space-y-4">
                  {profiles?.length > 0 ? (
                    profiles.map((item: ProfileType, index) => (
                      <div
                        className="flex justify-between items-center h-14 w-full bg-white rounded px-4"
                        key={index}
                      >
                        <p className="text-base font-medium text-gray-700">
                          {item.toneDescription.title}
                        </p>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setEditData(item);
                              setIsOpen(true);
                            }}
                            className="px-2 h-8 rounded bg-gray-200 text-gray-700 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-2 h-8 rounded bg-red-200 text-red-700 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-700 mt-10">
                      No Profile Added
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {isOpen && (
          <AddProfileModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setProfiles={setProfiles}
            isLoggedin={isLoggedin}
            editData={editData}
          />
        )}
      </div>
    </>
  );
};

export default Options;
