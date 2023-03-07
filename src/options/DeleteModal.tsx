import React from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import Modal from "./Modal";
import { ProfileType } from "../api";

const DeleteModal = ({ selectedProfile }: { selectedProfile: ProfileType }) => {
  const {
    isDeleteProfileModalOpen,
    setIsDeleteProfileModalOpen,
    DeleteProfile,
  } = useAuth();

  return (
    <Modal
      isOpen={isDeleteProfileModalOpen}
      closeModal={() => setIsDeleteProfileModalOpen(false)}
      cls="max-w-md container"
    >
      <div className="flex flex-col">
        <img src="info.svg" alt="user" className="w-12 h-12" />
        <div className="flex flex-col mt-3">
          <h1 className="text-base font-medium text-gray-700">
            Delete Profile
          </h1>
          <p className="text-xs text-gray-500">
            Are you sure you want to delete this profile? This action cannot be
            undone.
          </p>
        </div>
        <div className="border border-primary p-4 bg-primary/5 mt-4 rounded-lg">
          <p className="text-lg font-medium text-gray-700 truncate">
            {selectedProfile.toneDescription.title}
          </p>
          <div className="flex items-center flex-wrap gap-2 mt-2">
            {selectedProfile.toneDescription.skills.map((skill) => (
              <p
                key={skill}
                className="bg-primary text-white px-3 py-1 rounded-full text-xs"
              >
                {skill}
              </p>
            ))}
          </div>
          <p className="text-gray-500 mt-2 break-all">
            {selectedProfile.toneDescription.bio.length > 300
              ? selectedProfile.toneDescription.bio.slice(0, 300) + "..."
              : selectedProfile.toneDescription.bio}
          </p>
          <div className="flex items-center mt-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.7">
                <path
                  d="M6.87434 1.59375C3.83635 1.59375 1.37305 4.05705 1.37305 7.09504C1.37305 10.133 3.83635 12.5963 6.87434 12.5963C9.91233 12.5963 12.3756 10.133 12.3756 7.09504C12.3756 4.05705 9.91233 1.59375 6.87434 1.59375ZM6.87434 11.6631C4.35209 11.6631 2.3063 9.61728 2.3063 7.09504C2.3063 4.5728 4.35209 2.527 6.87434 2.527C9.39658 2.527 11.4424 4.5728 11.4424 7.09504C11.4424 9.61728 9.39658 11.6631 6.87434 11.6631Z"
                  fill="#667085"
                />
                <path
                  d="M9.01964 8.64963L7.26857 7.3836V4.34439C7.26857 4.29036 7.22436 4.24615 7.17033 4.24615H6.57968C6.52565 4.24615 6.48145 4.29036 6.48145 4.34439V7.7262C6.48145 7.75813 6.49618 7.7876 6.52197 7.80602L8.55302 9.28694C8.59723 9.31887 8.65862 9.30905 8.69055 9.26607L9.04175 8.78716C9.07368 8.74173 9.06385 8.68033 9.01964 8.64963Z"
                  fill="#667085"
                />
              </g>
            </svg>
            <p className="ml-1">
              Last updated :{" "}
              {new Date(selectedProfile.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex space-x-2 w-full">
        <button
          type="button"
          className="flex items-center justify-center rounded-md bg-gray-100 px-4 w-1/2 h-11 text-sm font-medium text-gray-700"
          onClick={() => setIsDeleteProfileModalOpen(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!selectedProfile.id) return toast.error("No profile selected");
            toast.promise(DeleteProfile(selectedProfile), {
              loading: "Deleting Profile",
              success: "Profile Deleted",
              error: "Something went wrong",
            });
          }}
          className="flex items-center justify-center rounded-md bg-red-600 px-4 w-1/2 h-11 text-sm font-medium text-white"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
