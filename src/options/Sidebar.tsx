import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import LogoutModal from "./LogoutModal";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, isSidebarOpen, setIsSidebarOpen } = useAuth();

  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className="flex flex-col pt-4 bg-secondary h-screen relative"
      id="left_drawer"
    >
      <div className={isSidebarOpen ? "px-4" : ""}>
        {isSidebarOpen ? (
          <img src="logoLight.svg" alt="logo" className="w-32 pt-2" />
        ) : (
          <img src="logoIcon.svg" alt="logo" className="w- pt-2" />
        )}
        <div
          className={`flex flex-col space-y-4 mt-6 ${!isSidebarOpen && "px-4"}`}
        >
          <button
            className={`flex items-center space-x-4 text-white text-sm font-medium bg-primary h-10 rounded ${
              isSidebarOpen ? "px-4" : "px-3"
            }`}
          >
            <img
              src="home.svg"
              alt="home"
              className={isSidebarOpen ? "w-6 h-6" : "w-7 h-7 "}
            />
            {isSidebarOpen && <span>Home</span>}
          </button>
        </div>
      </div>
      <div
        className={`absolute bottom-4 pt-4 border-t border-primary w-full px-3 flex items-center ${
          isSidebarOpen ? "flex-row space-x-4 " : "flex-col"
        }`}
      >
        {!isSidebarOpen && (
          <button onClick={() => setIsOpen(true)} className="w-14 h-14 mb-2">
            <img src="logoutIcon.svg" alt="logout" className="w-full h-full" />
          </button>
        )}
        <img
          src={user?.picture}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        {isSidebarOpen && (
          <>
            <div className="flex flex-col pt-[2px]">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-200">{user?.email}</p>
            </div>
            <button onClick={() => setIsOpen(true)} className="w-12 h-12">
              <img
                src="logoutIcon.svg"
                alt="logout"
                className="w-full h-full"
              />
            </button>
          </>
        )}
      </div>

      {isOpen && <LogoutModal setIsOpen={setIsOpen} isOpen={isOpen} />}

      <button
        onClick={handleOpen}
        className="w-10 h-10 flex items-center justify-center rounded-full border bg-lightPurple absolute -right-5 inset-y-[45%]"
      >
        {isSidebarOpen ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 8H1M1 8L8 15M1 8L8 1"
              stroke="#7F56D9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 8H15M15 8L8 1M15 8L8 15"
              stroke="#7F56D9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Sidebar;
