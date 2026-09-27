import type { Metadata } from "next";
import "./globals.css";
import { neuePlakExtended } from "./fonts";

export const metadata: Metadata = {
  title: "DesignCo Attendance",
  description: "DesignCo's Membership Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${neuePlakExtended.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
