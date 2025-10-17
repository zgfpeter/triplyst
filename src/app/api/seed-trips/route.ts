import postgres from "postgres";
import { trips } from "@/app/trip-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedTrips() {
    await sql`DROP TABLE IF EXISTS trips;`;
  // Create table if it doesn't exist
await sql`
  CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    destination TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    budget INT,
    type TEXT,
    description TEXT,
    UNIQUE(title, start_date)
  );
`;


  // Insert trips
  const inserted = await Promise.all(
    trips.map((trip) =>
      sql`
        INSERT INTO trips (title, destination, start_date, end_date, budget, type, description)
        VALUES (${trip.title},${trip.destination}, ${trip.startDate}, ${trip.endDate}, ${trip.budget}, ${trip.type}, ${trip.description})
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
