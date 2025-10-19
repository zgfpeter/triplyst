// test file to seed trips with some dummy data from my json file
import postgres from "postgres";
import { trips } from "@/app/trip-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
async function seedTrips() {
  // Get an existing user, have to run seed-users first

  const [testUser] = await sql`SELECT id FROM users LIMIT 1`;
  if (!testUser) throw new Error("No user found. Please seed users first.");

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
    user_id INT NOT NULL REFERENCES users(id),
    UNIQUE(title, start_date,user_id)
  );
`;

  // Insert trips with user_id
  for (const trip of trips) {
    await sql`
      INSERT INTO trips 
      (title, destination, start_date, end_date, budget, type, description, user_id)
      VALUES
      (${trip.title}, ${trip.destination}, ${trip.startDate}, ${trip.endDate}, ${trip.budget}, ${trip.type}, ${trip.description}, ${testUser.id})
      ON CONFLICT (title, start_date, user_id) DO NOTHING;
    `;
  }
}
// show a success or error message when seeding trips
export async function GET() {
  try {
    await seedTrips();
    return new Response(
      JSON.stringify({ message: "Trips seeded successfully" }),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Error seeding trips" }), {
      status: 500,
    });
  }
}
