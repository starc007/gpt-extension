import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useAuth } from "./AuthContext";

import "../assets/tailwind.css";

interface Props {
  isContentScript: boolean;
}

const Login: FC<Props> = ({ isContentScript }) => {
  const [loader, setLoader] = useState(false);
  const { setIsLoggedin, setUser, setProfiles, setLoading } = useAuth();

  const handleLogin = async () => {
    setLoader(true);
    chrome.runtime
      .sendMessage({
        message: "googleLogin",
        type: {
          isContentScript,
        },
      })
      .then((res) => {
        if (res?.message === "success") {
          chrome.runtime
            .sendMessage({
              type: "getUser",
            })
            .then((res) => {
              if (res) {
                setUser(res.data);
                setIsLoggedin(true);
                setLoading(true);
                toast.success("Login successful");
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
        setLoader(false);
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log("err", err);
        setLoader(false);
      });
  };
  return (
    <>
      <img
        src={chrome.runtime.getURL("logo.svg")}
        alt="logo"
        className="w-40 m-5"
      />
      <div className="flex flex-col items-center justify-center mt-32 px-6">
        <img
          src={chrome.runtime.getURL("logo.svg")}
          alt="logo"
          className="w-24 m-3"
        />
        <h1 className="text-3xl font-bold text-gray-700">
          Log in to your account
        </h1>
        <p className="mt-2 text-gray-500 text-sm">
          Welcome back! Please enter your details.
        </p>
        <button
          onClick={handleLogin}
          disabled={loader}
          className={`px-12 h-12 rounded-md text-gray-600 font-medium text-sm mt-5 flex items-center justify-center border hover:bg-gray-100 transition duration-300 ${
            loader
              ? "cursor-not-allowed bg-zinc-100 text-gray-500"
              : "cursor-pointer"
          } `}
        >
          <img
            src={chrome.runtime.getURL("google.svg")}
            alt="google"
            className="w-5 h-5 mr-3"
          />
          Sign in with Google{" "}
          {loader && <Loader cls="w-5 h-5 ml-3 text-gray-800" />}
        </button>
      </div>
    </>
  );
};

export default Login;
