import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Navbar from "../components/Navbar";
import Dropzone from "../components/Dropzone";

const Dashboard = async () => {
    const session = await getServerSession();
    if (!session) {
        redirect("/");
    }
  return (
    <div className="w-full bg-[#1e1e20] flex items-center flex-col">
        <div className="flex justify-center w-full my-6">
            <div className="w-96">
                <Dropzone />
            </div>
        </div>
    </div>
  );
};

export default Dashboard;