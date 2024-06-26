"use client";
import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useLanguage } from "@latitude/i18n";

type ILanguage = "pt-br" | "en-us";

export function LanguageSelector() {
  const { language, switchLanguage } = useLanguage();

  const handleSelect = (lang: ILanguage) => {
    switchLanguage(lang === "en-us" ? "en" : "pt");
  };

  return (
    <div className="flex items-center space-x-4">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
          {language === "en" ? "EN-US" : "PT-BR"}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <DropdownMenu.Item
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
            onSelect={() => handleSelect("en-us")}
          >
            EN-US
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
            onSelect={() => handleSelect("pt-br")}
          >
            PT-BR
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}

export default LanguageSelector;
