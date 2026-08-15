import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rune Atelier — English Rune Translator",
  description: "Translate runic marks into English with a refined, interactive alphabet.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
