import React, { useEffect, useState } from "react";
import AddProfileModal from "./AddProfileModal";
import toast, { Toaster } from "react-hot-toast";
import { fetchProfiles, ProfileType, __logout, __deleteProfile } from "../api";
import Login from "./Login";
import Sidebar from "./Sidebar";
import { useAuth } from "./AuthContext";
import Loader from "./Loader";
import Profiles from "./Profiles";

const Options = () => {
  const {
    isLoggedin,
    isSidebarOpen,
    profiles,
    isAddProfileModalOpen,
    setIsAddProfileModalOpen,
    loading,
    setEditData,
  } = useAuth();

  return (
    <>
      <Toaster
        toastOptions={{
          className: "!border-gray-300 border !shadow-2xl",
        }}
        position="top-center"
      />
      {!isLoggedin ? (
        <Login />
      ) : (
        <div className="flex h-screen md:px-0 px-4">
          <div
            className={
              isSidebarOpen
                ? "w-96 transition-all duration-300"
                : "w-20 transition-all duration-300"
            }
          >
            <Sidebar />
          </div>
          <section className="w-full overflow-y-auto p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">
                Profiles{" "}
                <span className="text-xl text-gray-500">
                  ({profiles?.length})
                </span>
              </h1>
              {profiles?.length > 0 && (
                <button
                  onClick={() => {
                    setEditData(null);
                    setIsAddProfileModalOpen(true);
                  }}
                  className="bg-primary px-4 h-10 text-white rounded-lg text-sm"
                >
                  + Add Profile
                </button>
              )}
            </div>
            {!loading && profiles?.length === 0 && (
              <div className="w-full flex justify-center">
                <div className="mt-16 flex flex-col items-center w-1/2 rounded-lg bg-lightPurple lg:px-12 px-4 py-10">
                  <img src="Noprofile.svg" alt="empty" className="w-56" />
                  <p className="text-lg font-semibold text-gray-700 mt-4">
                    You have no profiles to display
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add multiple profiles for different roles to increase your
                    luck.
                  </p>
                  <button
                    onClick={() => {
                      setEditData(null);
                      setIsAddProfileModalOpen(true);
                    }}
                    className="w-full h-11 rounded-md bg-primary text-white text-sm mt-4"
                  >
                    + Create Profile
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="w-full mt-20 flex justify-center">
                <Loader cls="w-8 h-8" />
              </div>
            )}

            {!loading && profiles?.length > 0 && <Profiles />}
          </section>

          {isAddProfileModalOpen && <AddProfileModal />}
        </div>
      )}
    </>
  );
};

export default Options;
