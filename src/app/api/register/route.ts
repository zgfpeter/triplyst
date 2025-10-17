import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: require });
// registers a new user to my database
export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`INSERT INTO users(email,username,password_hash) VALUES(${email},${username},${hashedPassword})`;

    return new Response(
      JSON.stringify({ message: "User registered successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }
}
