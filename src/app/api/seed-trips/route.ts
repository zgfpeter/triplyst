import postgres from "postgres";
import { trips } from "@/app/trip-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedTrips() {
    //await sql`DROP TABLE IF EXISTS trips;`;
  // Create table if it doesn't exist
await sql`
  CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    destination TEXT NOT NULL,
    budget INT NOT NULL,
    type TEXT NOT NULL,
    UNIQUE(title, start_date)
  );
`;


  // Insert trips
  const inserted = await Promise.all(
    trips.map((trip) =>
      sql`
        INSERT INTO trips (title, start_date, end_date, destination, budget, type)
        VALUES (${trip.title}, ${trip.startDate}, ${trip.endDate}, ${trip.destination}, ${trip.budget}, ${trip.type})
        ON CONFLICT (title, start_date) DO NOTHING;
      `
    )
  );

  return inserted;
}

export async function GET() {
  try {
    await sql.begin(async (sqlTx) => {
      await seedTrips();
    });

    return new Response(JSON.stringify({ message: "Trips seeded successfully" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
