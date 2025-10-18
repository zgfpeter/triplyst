import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import postgres from "postgres";
import { redirect } from "next/navigation";
import { Trip } from "@/types/Trip";
import SingleTripClient from "@/app/components/SingleTripClient";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const [user] = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
  return user?.id || null;
}

export default async function SingleTripPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/userLogin");

  const userId = await getUserId();
  if (!userId) redirect("/userLogin");

  const [trip] = await sql<Trip[]>`SELECT * FROM trips WHERE id = ${params.id} AND user_id = ${userId}`;
  if (!trip) return <p className="loading__item">Trip not found</p>;

  return <SingleTripClient trip={trip} session={session} />;
}
