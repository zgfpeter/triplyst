import postgres from "postgres";
import { Trip } from "@/types/Trip";
// get the logged in user
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// get logged-in user id
// so i can fetch each user's trips
async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const [user] = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
  return user?.id || null;
}

// GET: fetch trips (all for user or single trip)
export async function GET(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const result = await sql<Trip[]>`SELECT * FROM trips WHERE id = ${id} AND user_id = ${userId};`;
      if (result.length === 0) return new Response(JSON.stringify({ error: "Trip not found" }), { status: 404 });
      return new Response(JSON.stringify(result[0]), { status: 200 });
    } else {
      const trips = await sql<Trip[]>`SELECT * FROM trips WHERE user_id = ${userId} ORDER BY start_date ASC;`;
      return new Response(JSON.stringify(trips), { status: 200 });
    }
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch trips" }), { status: 500 });
  }
}



// POST: add a new trip
export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

    const body = await req.json();
    const { title, destination, start_date, end_date, budget, type, description } = body;

    if (!title || !start_date || !end_date) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const result = await sql`
      INSERT INTO trips 
        (title, destination, start_date, end_date, budget, "type", description, user_id)
      VALUES
        (${title}, ${destination}, ${start_date}, ${end_date}, ${budget || null}, ${type || null}, ${description || null}, ${userId})
      RETURNING *;
    `;

    return new Response(JSON.stringify(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/trips error:", error);
    return new Response(JSON.stringify({ error: "Failed to add trip" }), { status: 500 });
  }
}

// PUT: update a trip
export async function PUT(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

    const { searchParams } = new URL(req.url);
    const idFromQuery = searchParams.get("id");

    const body = await req.json();
    const { id: idFromBody, title, destination, start_date, end_date, budget, type, description } = body;
    const id = idFromQuery || idFromBody;

    if (!id) return new Response(JSON.stringify({ error: "Missing trip ID" }), { status: 400 });

    const result = await sql`
      UPDATE trips
      SET
        title = ${title},
        destination = ${destination},
        start_date = ${start_date},
        end_date = ${end_date},
        budget = ${budget || null},
        "type" = ${type || null},
        description = ${description || null}
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *;
    `;

    if (result.length === 0) return new Response(JSON.stringify({ error: "Trip not found" }), { status: 404 });
    return new Response(JSON.stringify(result[0]), { status: 200 });
  } catch (error) {
    console.error("PUT /api/trips error:", error);
    return new Response(JSON.stringify({ error: "Failed to update trip" }), { status: 500 });
  }
}

// delete a trip based on id
export async function DELETE(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Missing trip ID" }), { status: 400 });

    const result = await sql`DELETE FROM trips WHERE id = ${id} AND user_id = ${userId} RETURNING *;`;
    if (result.length === 0) return new Response(JSON.stringify({ error: "Trip not found" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Trip deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("DELETE /api/trips error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete trip" }), { status: 500 });
  }
}