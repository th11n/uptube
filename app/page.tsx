import { Header } from "./components/Header";
import Navbar from "./components/Navbar";
import { signIn } from "next-auth/react";

const Home = () => {
  return <>
   <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="flex flex-col">
         <Header />
      </div>
   </div>
   </>
   ;
};

export default Home;