import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/toaster";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Confession River",
  description: "Drop your truth into the night.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${firaCode.variable} antialiased bg-black`}
        style={{ fontFamily: "Fira Code, monospace" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
