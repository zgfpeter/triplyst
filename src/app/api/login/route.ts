import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: require });

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = users[0] // postgres() returns an array
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Inalid password" }), {
        status: 401,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: { id: user.id, username: user.username, email: user.email },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// could manually add JWT + cookie for manual authentication
// better way - use next-auth, integrates with google,github etc
