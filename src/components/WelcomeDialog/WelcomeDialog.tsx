"use client";
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import LanguageSelector from "@latitude/components/LanguageSelector";
import { useLanguage } from "@latitude/i18n";

export function WelcomeDialog() {
  const { translate } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-neutral-900 p-[25px] shadow-lg shadow-neutral-950 focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 font-medium">
            {translate("title")}
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 leading-normal">
            {translate("description")}
          </Dialog.Description>
          <ul className="text-mauve11 mt-[10px] mb-5 leading-normal list-disc list-inside">
            <li>{translate("instructions_item1")}</li>
            <li>{translate("instructions_item2")}</li>
            <li>{translate("instructions_item3")}</li>
            <li>{translate("instructions_item4")}</li>
            <li>{translate("instructions_item5")}</li>
          </ul>
          <div className="text-mauve11 mt-[10px] mb-5 leading-normal">
            {translate("language_prompt")}
          </div>
          <div className="w-full flex items-center justify-center">
            <LanguageSelector />
          </div>
          <Dialog.Close asChild>
            <button
              data-testid="welcome-dialog-close-button"
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
