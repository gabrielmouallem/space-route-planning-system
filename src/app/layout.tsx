import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SpaceNavigationContextProvider from "@latitude/contexts/spaceNavigationContext/spaceNavigationContext";
import { LanguageProvider } from "@latitude/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Space Route Planning System",
  description:
    "Optimize interstellar travel with our Space Route Planning System—efficiently planning fuel and refueling for astronauts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <SpaceNavigationContextProvider>
            {children}
          </SpaceNavigationContextProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
