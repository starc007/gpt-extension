import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreatableSelect from "react-select/creatable";
import { __addProfile, __updateProfile, ProfileType, Datatype } from "../api";
import { useAuth } from "./AuthContext";
import Modal from "./Modal";
import { skills } from "./skills";

// interface Props {
//   editData?: ProfileType;
// }

const cmnLabel = "text-gray-600 text-sm mb-1";
const cmnClass =
  "border rounded px-2 h-10 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent";

const AddProfileModal = () => {
  const {
    isLoggedin,
    AddProfile,
    UpdateProfile,
    isAddProfileModalOpen,
    setIsAddProfileModalOpen,
    formData,
    setFormData,
    editData,
  } = useAuth();

  useEffect(() => {
    if (editData?.toneDescription) {
      const skills = editData?.toneDescription.skills.map((skill) => ({
        label: skill,
        value: skill,
      }));
      setFormData({
        title: editData?.toneDescription.title,
        skills,
        bio: editData?.toneDescription.bio,
      });
    } else {
      setFormData({
        title: "",
        skills: [],
        bio: "",
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleSubmit = async () => {
    if (editData) {
      toast.promise(UpdateProfile(formData, editData), {
        loading: "Updating profile",
        success: "Profile updated successfully",
        error: "Something went wrong",
      });
    } else {
      if (!isLoggedin) return toast.error("Please login to add profile");
      if (!formData.title || !formData.skills || !formData.bio) {
        return toast.error("Please fill all the fields");
      }
      toast.promise(AddProfile(formData), {
        loading: "Adding profile",
        success: "Profile added successfully",
        error: "Something went wrong",
      });
    }
  };

  return (
    <Modal
      isOpen={isAddProfileModalOpen}
      closeModal={() => setIsAddProfileModalOpen(false)}
      cls="max-w-md container"
    >
      <div className="flex items-center">
        <img src="user.svg" alt="user" className="w-12 h-12" />
        <div className="flex flex-col ml-4">
          <h1 className="text-base font-medium text-gray-700">
            {editData ? "Edit Profile" : "Add Profile"}
          </h1>
          <p className="text-xs text-gray-500">
            {editData ? "Edit your profile" : "Enter your profile details"}
          </p>
        </div>
      </div>
      <div className="flex flex-col space-y-4 mt-4">
        {" "}
        <div className="flex flex-col">
          <label className={cmnLabel}>Profile Title</label>
          <input
            type="text"
            name="title"
            className={cmnClass}
            placeholder="e.g: Full Stack Developer"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className={cmnLabel}>Skills</label>
          <CreatableSelect
            isMulti
            options={skills}
            className="h-11 w-full"
            maxMenuHeight={150}
            styles={{
              control: (provided) => ({
                ...provided,
                border: "1px solid #e2e8f0",
                "&:focus": {
                  boxShadow: "none",
                  outline: "none",
                },
                "&:hover": {
                  border: "1px solid #e2e8f0",
                },
                height: "42px",
              }),
              indicatorSeparator: (state) => ({
                display: "none",
              }),
            }}
            theme={(theme) => {
              return {
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#7F56D9",
                },
              };
            }}
            placeholder="e.g: React, Node, Express"
            value={formData.skills}
            onChange={(e) => {
              if (e.length > 5) {
                toast.error("Only 5 skills are allowed");
                return;
              }
              setFormData({ ...formData, skills: e });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label className={cmnLabel}>Bio</label>
          <textarea
            name="bio"
            rows={3}
            className="border rounded p-2 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g: I am a full stack developer."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            required
          ></textarea>
        </div>
      </div>

      <div className="mt-4 flex space-x-2 w-full">
        <button
          type="button"
          className="flex items-center justify-center rounded-md bg-gray-100 px-4 w-1/2 h-11 text-sm font-medium text-gray-700"
          onClick={() => setIsAddProfileModalOpen(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={HandleSubmit}
          className="flex items-center justify-center rounded-md bg-primary px-4 w-1/2 h-11 text-sm font-medium text-white"
        >
          {editData ? "Update" : "Add"} Profile
        </button>
      </div>
    </Modal>
  );
};

export default AddProfileModal;
