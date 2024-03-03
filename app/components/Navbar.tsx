"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const { data: session, status: sessionStatus } = useSession();

    // useEffect(() => {
    //     if (sessionStatus === "authenticated") {
    //         router.replace("/dashboard");
    //     }
    // }, [sessionStatus, router]);

    if (sessionStatus === "loading") {
        return <h1>Loading...</h1>;
    }
    return (
        <div className="flex justify-between w-2/3 my-6">
            <div>
                <Link href="/" className="font-semibold text-[#fffff5db] text-2xl">upTube</Link>
            </div>
            <div>
                {
                    sessionStatus !== "authenticated" ? (
                        <button className="border-2 border-[#252529] hover:border-[#44b78b] px-4 py-2 rounded-lg transition text-sm font-bold text-[#fffff5db] hover:cursor-pointer" onClick={() => { signIn("google", {callbackUrl: "/dashboard"}) }}>Sign In</button>
                    ) : (
                        <button onClick={() => { signOut(); }} className="z-10 inline-flex gap-1 h-12 animate-shimmer items-center justify-center rounded-md border border-[#421c1c] hover:border-red-500 bg-[linear-gradient(110deg,#1e1e20,45%,#421c1c,55%,#1e1e20)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">Log out</button>
                    )
                }
            </div>
        </div>
    )
};

export default Navbar;