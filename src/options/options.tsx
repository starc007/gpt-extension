import React, { useEffect, useState } from "react";
import AddProfileModal from "./AddProfileModal";
import toast, { Toaster } from "react-hot-toast";

const HOST = "http://vakya.ai";
const SUCCESS_URL = [
  "https://vakya.ai/api/v1/login/success",
  "http://vakya.ai/api/v1/login/success",
];

const Options = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cookieData, setCookieData] = useState<any>(null);

  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    chrome.storage.sync.get("profiles", (data) => {
      if (data.profiles) {
        setProfiles(data.profiles);
      }
    });
  }, []);

  // useEffect(() => {
  //   if (cookieData) {
  //     console.log("cookieData", cookieData);
  //     chrome.cookies.set(
  //       {
  //         domain: cookieData.domain,
  //         expirationDate: cookieData.expirationDate,
  //         httpOnly: cookieData.httpOnly,
  //         name: cookieData.name,
  //         path: cookieData.path,
  //         sameSite: cookieData.sameSite,
  //         secure: cookieData.secure,
  //         storeId: cookieData.storeId,
  //         value: cookieData.value,
  //         url: "http://vakya.ai",
  //       },
  //       () => {
  //         console.log("cookie set successfully");
  //         fetch("http://vakya.ai/api/v1/login/success", {
  //           method: "GET",
  //           credentials: "include",
  //         }).then((res) => {
  //           console.log("res", res);
  //         });
  //       }
  //     );
  //   }
  // }, [cookieData]);

  const handleDelete = (id: number) => {
    const newProfiles = profiles.filter((profile) => profile.id !== id);
    chrome.storage.sync.set({ profiles: newProfiles }, () => {
      setProfiles(newProfiles);
      toast.success("Profile deleted successfully");
    });
  };

  const handleLogin = async () => {
    console.log("login request sent to background.....");
    chrome.runtime
      .sendMessage({
        message: "googleLogin",
      })
      .then((res) => {
        console.log("res", res);
      });
    // chrome.windows.create(
    //   {
    //     url: `${HOST}/api/v1/login/google`,
    //     type: "popup",
    //     focused: true,
    //     width: 500,
    //     height: 500,
    //   },
    //   (window) => {
    //     console.log("coming from content2.....", window);
    //     chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    //       console.log(changeInfo.url);
    //       if (
    //         changeInfo.url === SUCCESS_URL[0] ||
    //         changeInfo.url === SUCCESS_URL[1]
    //       ) {
    //         chrome.cookies.get(
    //           {
    //             url: "http://vakya.ai",
    //             name: "connect.sid",
    //           },
    //           (cookie) => {
    //             setCookieData(cookie);
    //             chrome.tabs.onUpdated.removeListener(() => {});
    //             chrome.windows.remove(window.id);
    //           }
    //         );
    //       }
    //     });
    //   }
    // );

    //
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
            <div className="flex flex-col w-full rounded bg-gray-100 lg:p-6 p-4">
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
            <div className="flex flex-col w-full rounded bg-gray-100 lg:px-6 px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-700">
                  All Profiles
                </p>
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-24 h-10 rounded-md bg-primary text-white text-sm"
                >
                  Add Profile
                </button>
                <AddProfileModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  setProfiles={setProfiles}
                />
              </div>

              <div className="flex flex-col mt-4 space-y-4">
                {profiles.length > 0 ? (
                  profiles.map((profile, index) => (
                    <div
                      className="flex justify-between items-center h-14 w-full bg-white rounded px-4"
                      key={index}
                    >
                      <p className="text-base font-medium text-gray-700">
                        {profile.title}
                      </p>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            // clear all data from storage
                            chrome.storage.sync.clear(() => {
                              // set new data
                            });
                          }}
                          className="px-2 h-8 rounded bg-gray-200 text-gray-700 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(profile.id)}
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
          </section>
        </div>
      </div>
    </>
  );
};

export default Options;
