import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import UserHomePage from "./mainPage/page";
import Navbar from "./components/Navbar";

export default async function LandingPage(){
  const session = await getServerSession(authOptions);
  if(!session){
    redirect("/userLogin"); // redirect to the login page if user not logged in
  }

  return (
    <main>
      <Navbar/>
      <UserHomePage/>
    </main>
  )
}