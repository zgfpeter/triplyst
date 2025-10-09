import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Type definition ( maybe move to another file)
export type Trip = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  destination: string;
  budget: number;
  type: "VACATION" | "BUSINESS" | "FAMILY" | "";
};

// Route handles GET /api/trips/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await params; // await params, otherwise error
    const tripId = Number(id); 

    const result = await sql<Trip[]>`
      SELECT * FROM trips WHERE id = ${tripId};
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Trip not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const trip = result[0];

    return new Response(JSON.stringify(trip), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching trip:", error);
  }
}