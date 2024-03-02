import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "upTube",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="!h-screen">
          <div className="w-full bg-[#1e1e20]">
            {/* <Navbar /> */}
            {/* <div className="h-px w-full bg-[#252529]"></div> */}
            {children}
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}