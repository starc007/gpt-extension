import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useAuth } from "./AuthContext";

// import "../assets/tailwind.css";

import { UPWORK_ID, FREELANCER_ID } from "../contentScript/config";
const hostName = window.location.hostname;

interface Props {
  isContentScript: boolean;
}

const Login: FC<Props> = ({ isContentScript }) => {
  const [loader, setLoader] = useState(false);
  const { setIsLoggedin, setUser, setProfiles, setLoading } = useAuth();

  const handleLogin = async () => {
    const CATEGORY_ID =
      hostName === "www.upwork.com"
        ? UPWORK_ID
        : hostName === "www.freelancer.com"
        ? FREELANCER_ID
        : null;

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
                    categoryID: CATEGORY_ID,
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
      {/* <img
        src={chrome.runtime.getURL("logoDark.svg")}
        alt="logo"
        className="w-40 m-5"
      /> */}
      <div className="sb__loginContainer">
        <img
          src={chrome.runtime.getURL("logoDark.svg")}
          alt="logo"
          style={{
            width: "128px",
            margin: "12px",
          }}
        />
        <h1 className="sb__loginContainertxt">Log in to your account</h1>
        <p className="sb__loginContainerdesc">
          Welcome back! Please enter your details.
        </p>
        <button
          onClick={handleLogin}
          disabled={loader}
          className={`sb__loginBtn ${
            loader ? "sb__loginBtndisabled" : "csr__pointer"
          } `}
        >
          <img
            src={chrome.runtime.getURL("google.svg")}
            alt="google"
            style={{
              width: "20px",
              height: "20px",
              marginRight: "12px",
            }}
          />
          Sign in with Google {loader && <Loader cls="loader_cls" />}
        </button>
      </div>
    </>
  );
};

export default Login;
