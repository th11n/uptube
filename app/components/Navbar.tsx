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
                        <button onClick={() => { signOut(); }} className="border-2 border-[#252529] hover:border-[#F07178] px-4 py-2 rounded-lg transition text-sm font-bold text-[#fffff5db] hover:cursor-pointer">Log out</button>
                    )
                }
            </div>
        </div>
    )
};

export default Navbar;