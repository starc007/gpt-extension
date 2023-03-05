import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  cls?: string;
  title?: string;
};

const Modal: React.FC<Props> = ({
  isOpen,
  closeModal,
  children,
  title,
  cls,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={closeModal}>
        <div className="h-screen p-2 text-center">
          <Transition.Child
            as="div"
            enter="ease-in "
            enterFrom="opacity-0"
            enterTo="opacity-100 "
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo=" opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 backdrop-brightness-50" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="translate-y-40 opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={`inline-block bg-white text-left overflow-hidden shadow-xl transform transition-all align-middle w-full rounded-lg p-6 border  ${cls}`}
            >
              {/* {title && (
                <Dialog.Title className="text-lg sm:text-xl md:text-2xl font-bold">
                  {title}
                </Dialog.Title>
              )} */}

              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
