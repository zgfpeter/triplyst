import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: require });

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    //get the user with the specific email from the database
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = users[0]; // postgres() returns an array
    // if user not found
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    // if user found, check password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Inalid password" }), {
        status: 401,
      });
    }
    // if user found and passwords match, login successful
    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: { id: user.id, username: user.username, email: user.email },
      }),
      {
        status: 200,
      }
    );
    // error handling
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    } else {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
      });
    }
  }
}

// could manually add JWT + cookie for manual authentication
// better way - use next-auth, integrates with google,github etc
