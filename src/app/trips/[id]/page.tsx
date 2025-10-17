import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SingleTrip from "@/app/components/SingleTrip"

export default async function SingleTripPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/userLogin");

  // session down as a prop
  return <SingleTrip params={params} session={session} />; 
}
