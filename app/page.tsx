import Login from "./components/Login";

import { signIn } from "next-auth/react";

const Home = () => {
  return <>
   <div>
      <Login />
   </div>
   </>
   ;
};

export default Home;