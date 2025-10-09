// src/app/api/trips/route.ts
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type Trip = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  destination: string;
  budget: number;
  type: "VACATION" | "BUSINESS" | "FAMILY" | "";
};

export async function GET() {
  try {
    const trips = await sql<Trip[]>`
      SELECT * FROM trips ORDER BY start_date ASC;
    `;

    return new Response(JSON.stringify(trips), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch trips" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
