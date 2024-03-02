"use client";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { HoverEffect } from "./ui/card-hover-effect";
import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "./ui/background-beams";

export function Header() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();
  const words = [
    {
      text: "Upload",
      className: "text-white",
    },
    {
      text: "audio",
      className: "text-white",
    },
    {
      text: "files",
      className: "text-white",
    },
    {
      text: "with",
      className: "text-white",
    },
    {
      text: "upTube.",
      className: "text-[#44b78b] dark:text-[#44b78b]",
    },
  ];
  return (
    <div className="flex flex-col gap-24 items-center justify-center h-full">
            <BackgroundBeams className="z-0"/>
      <div className="flex flex-col items-center justify-center w-full">
        <p className="text-slate-400 text-xs sm:text-base w-96 text-center">
          fast and easy audio upload services
        </p>
        <TypewriterEffectSmooth words={words} />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          {
            sessionStatus !== "authenticated" ? (
              <button onClick={() => { signIn("google", { callbackUrl: "/dashboard" }) }} className="z-10 inline-flex gap-1 h-12 animate-shimmer items-center justify-center rounded-md border border-[#112f23] hover:border-[#44b78b] bg-[linear-gradient(110deg,#1e1e20,45%,#112f23,55%,#1e1e20)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                Sign in
              </button>
            ) : (
              <button onClick={() => { router.push("/dashboard") }} className="z-10 inline-flex gap-1 h-12 animate-shimmer items-center justify-center rounded-md border border-[#112f23] hover:border-[#44b78b] bg-[linear-gradient(110deg,#1e1e20,45%,#112f23,55%,#1e1e20)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                Dashboard
              </button>
            )
          }
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-8">
        <HoverEffect items={projects} />
      </div>
    </div>
  );
}

export const projects = [
  {
    title: "Step 1",
    description:
      "Log in to dashboard with your youtube account and choose audio file",
    link: "https://stripe.com",
  },
  {
    title: "Step 2",
    description:
      "Fill in the form with required informations and press submit",
    link: "https://netflix.com",
  },
  {
    title: "Step 3",
    description:
      "Wait till video uploads to youtube",
    link: "https://google.com",
  },
];
