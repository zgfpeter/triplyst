import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type Trip = {
  id: number;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  type: "VACATION" | "BUSINESS" | "FAMILY" | "";
  description?: string;
};

// GET: fetch trip with specific id, for one trip ( like edit trip )
// otherwise fetch all
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch one trip
      const result = await sql<Trip[]>`SELECT * FROM trips WHERE id = ${id};`;

      if (result.length === 0) {
        return new Response(JSON.stringify({ error: "Trip not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(result[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Fetch all trips
      const trips = await sql<Trip[]>`SELECT * FROM trips ORDER BY start_date ASC;`;
      return new Response(JSON.stringify(trips), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch trips" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


// POST: add a new trip
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST /api/trips body:", body); // log the incoming request

    const { title, destination, start_date, end_date, budget, type, description } = body;

    // Validate required fields
    if (!title || !start_date || !end_date) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert new trip into database
    const result = await sql`
      INSERT INTO trips 
      (title, destination, start_date, end_date, budget, "type", description)
      VALUES 
      (${title}, ${destination}, ${start_date}, ${end_date}, ${budget || null}, ${type || null}, ${description || null})
      RETURNING *;
    `;

    console.log("Inserted trip:", result[0]); // log database response

    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /api/trips error:", error);
    return new Response(JSON.stringify({ error: "Failed to add trip" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT: update a trip
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idFromQuery = searchParams.get("id");

    const body = await req.json();
    const {
      id: idFromBody,
      title,
      destination,
      start_date,
      end_date,
      budget,
      type,
      description,
    } = body;

    const id = idFromQuery || idFromBody;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing trip ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Trip not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT /api/trips error:", error);
    return new Response(JSON.stringify({ error: "Failed to update trip" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


// delete a trip based on id
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing trip ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await sql`DELETE FROM trips WHERE id = ${id} RETURNING *;`;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Trip not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Trip deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE /api/trips error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete trip" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
