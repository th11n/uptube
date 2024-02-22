"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Navbar = () => {
    const { data: session }: any = useSession();

  return (
    <div className="flex justify-between w-2/3 my-6">
        <div>
            <h1 className="font-semibold text-[#fffff5db] text-2xl">upTube</h1>
        </div>
        <div>
            <button onClick={() => {signOut();}} className="border-2 border-[#252529] hover:border-[#F07178] px-4 py-2 rounded-lg transition text-sm font-bold text-[#fffff5db] hover:cursor-pointer">Log out</button>
        </div>
    </div>
    )
};

export default Navbar;