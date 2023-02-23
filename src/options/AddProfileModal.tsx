import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { __addProfile, __updateProfile, ProfileType } from "../api";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProfiles: React.Dispatch<React.SetStateAction<ProfileType[] | []>>;
  isLoggedin: boolean;
  editData?: ProfileType;
}

const cmnLabel = "text-gray-600 text-sm mb-1";
const cmnClass =
  "border rounded px-2 h-10 transition duration-300 focus:outline-none focus:ring-1 focus:ring-blue-500";

const AddProfileModal: FC<Props> = ({
  isOpen,
  setIsOpen,
  setProfiles,
  isLoggedin,
  editData,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    skills: "",
    experience: "",
    clients: "",
    portfolioLink: "",
    name: "",
  });

  useEffect(() => {
    if (editData?.toneDescription) {
      setFormData(editData?.toneDescription);
    } else {
      setFormData({
        title: "",
        skills: "",
        experience: "",
        clients: "",
        portfolioLink: "",
        name: "",
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const AddData = async () => {
    if (!isLoggedin) {
      toast.error("Please login to add profile");
      return;
    }
    if (
      !formData.title ||
      !formData.skills ||
      !formData.experience ||
      !formData.name
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    const res = await __addProfile(formData, setProfiles);
    if (res) {
      toast.success("Profile added successfully");
      setIsOpen(false);
      setFormData({
        title: "",
        skills: "",
        experience: "",
        clients: "",
        portfolioLink: "",
        name: "",
      });
    } else {
      toast.error("Something went wrong");
    }
  };

  const updateData = async () => {
    if (!isLoggedin) {
      toast.error("Please login to add profile");
      return;
    }
    if (!editData) return toast.error("Something went wrong");
    const res = await __updateProfile(formData, editData);
    if (res) {
      toast.success("Profile updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 400);
      setIsOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900"
                >
                  {editData ? "Edit Profile" : "Add Profile"}
                </Dialog.Title>
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  <div className="flex flex-col">
                    <label className={cmnLabel}>
                      Profile Title <span className="text-red-500">*</span>
                    </label>
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
                    <label className={cmnLabel}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={cmnClass}
                      placeholder="e.g: Saurabh"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={cmnLabel}>
                      Skills <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="skills"
                      className={cmnClass}
                      placeholder="e.g: React, Bahut kuch"
                      value={formData.skills}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={cmnLabel}>
                      Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="experience"
                      className={cmnClass}
                      placeholder="e.g: 1 year"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={cmnLabel}>Clients</label>
                    <input
                      type="text"
                      name="clients"
                      className={cmnClass}
                      placeholder="e.g: Playota, G69"
                      value={formData.clients}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={cmnLabel}>Portfolio Link</label>
                    <input
                      type="text"
                      name="portfolioLink"
                      className={cmnClass}
                      placeholder="e.g: https://saura3h.xyz"
                      value={formData.portfolioLink}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={editData ? updateData : AddData}
                    className="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    {editData ? "Update" : "Add"} Profile
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddProfileModal;
