"use client";
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import LanguageSelector from "@latitude/components/LanguageSelector";

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-neutral-900 p-[25px] shadow-lg shadow-neutral-950 focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 font-medium">
            🚀 Welcome to the Space Route Planning System!
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 leading-normal">
            Your journey starts on Earth. Plan your trips through the solar
            system, simulate fuel requirements, and find the best refueling
            points. Ensure you have enough fuel for each leg of your journey and
            enjoy exploring the vastness of space!
          </Dialog.Description>
          <ul className="text-mauve11 mt-[10px] mb-5 leading-normal list-disc list-inside">
            <li>Determine your current location in the solar system.</li>
            <li>Simulate trips and calculate the required fuel.</li>
            <li>Update your position after each successful trip.</li>
            <li>Find the nearest planet for refueling if needed.</li>
            <li>
              Distances between planets and fuel consumption ratios are
              considered for accurate simulations.
            </li>
          </ul>
          <div className="text-mauve11 mt-[10px] mb-5 leading-normal">
            Before you start, please choose your language and then you can close
            this dialog.
          </div>
          <div className="w-full flex items-center justify-center">
            <LanguageSelector />
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
