import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProfiles: any;
}

const cmnLabel = "text-gray-600 text-sm mb-1";
const cmnClass =
  "border rounded px-2 h-10 transition duration-300 focus:outline-none focus:ring-1 focus:ring-blue-500";

const AddProfileModal: FC<Props> = ({ isOpen, setIsOpen, setProfiles }) => {
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    skills: "",
    experience: "",
    clients: "",
    portfolioLink: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.skills ||
      !formData.experience ||
      !formData.name
    ) {
      toast.error("Please fill all the required fields");
      return;
    }
    console.log("adding data....", formData);
    formData.id = new Date().getTime();
    // push data to chrome storage
    chrome.storage.sync.get("profiles", (data) => {
      if (data.profiles) {
        const profiles = data.profiles;
        // push formData to profiles at the beginning
        profiles.unshift(formData);
        chrome.storage.sync.set({ profiles }, () => {
          console.log("data saved");
          toast.success("Profile added successfully");
          setIsOpen(false);
          setProfiles(profiles);
          setFormData({
            id: 0,
            title: "",
            skills: "",
            experience: "",
            clients: "",
            portfolioLink: "",
            name: "",
          });
        });
      } else {
        chrome.storage.sync.set({ profiles: [formData] }, () => {
          console.log("data saved");
          toast.success("Profile added successfully");
          setIsOpen(false);
          setProfiles([formData]);
          setFormData({
            id: 0,
            title: "",
            skills: "",
            experience: "",
            clients: "",
            portfolioLink: "",
            name: "",
          });
        });
      }
    });
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
                  Add Profile
                </Dialog.Title>
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  <div className="flex flex-col">
                    <label htmlFor="title" className={cmnLabel}>
                      Profile Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className={cmnClass}
                      placeholder="e.g: Full Stack Developer"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="name" className={cmnLabel}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={cmnClass}
                      placeholder="e.g: Saurabh"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="skills" className={cmnLabel}>
                      Skills <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      className={cmnClass}
                      placeholder="e.g: React, Bahut kuch"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="experience" className={cmnLabel}>
                      Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      className={cmnClass}
                      placeholder="e.g: 1 year"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="clients" className={cmnLabel}>
                      Clients
                    </label>
                    <input
                      type="text"
                      id="clients"
                      name="clients"
                      className={cmnClass}
                      placeholder="e.g: Playota, G69"
                      value={formData.clients}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="portfolioLink" className={cmnLabel}>
                      Portfolio Link
                    </label>
                    <input
                      type="text"
                      id="portfolioLink"
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
                    onClick={handleSubmit}
                    className="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    Add Profile
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
