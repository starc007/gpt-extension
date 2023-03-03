import React, { FC } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogoutModal: FC<Props> = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  return (
    <Modal
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      cls="max-w-md container"
    >
      <div className="flex flex-col space-y-4 items-center justify-center ">
        <img src="logout.svg" alt="logout" />

        <p className="text-lg font-medium text-gray-700">
          Are you sure you want to log out from Vakya
        </p>
        <div className="flex space-x-4">
          <button
            className="w-32 h-10 rounded-md bg-gray-100 text-gray-700 text-sm"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="w-32 h-10 rounded-md bg-primary text-white text-sm"
            onClick={() => {
              toast.promise(logout(), {
                loading: "Logging out...",
                success: "Logged out successfully",
                error: "Failed to logout",
              });
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
