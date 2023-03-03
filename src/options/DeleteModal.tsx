import React from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import Modal from "./Modal";

const DeleteModal = ({ selectedId }: { selectedId: string }) => {
  const {
    isDeleteProfileModalOpen,
    setIsDeleteProfileModalOpen,
    DeleteProfile,
  } = useAuth();

  console.log(selectedId, "selectedId");
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
            if (!selectedId) return toast.error("No profile selected");
            toast.promise(DeleteProfile(selectedId), {
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
