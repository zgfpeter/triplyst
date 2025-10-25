// [...nextauth] is a special catch-all route used by NextAuth
import NextAuth, { AuthOptions, User } from "next-auth"; // handles authentication routes and sessions
import CredentialsProvider from "next-auth/providers/credentials";
import postgres from "postgres";
import bcrypt from "bcrypt";
// connects to my postgresql database
// rejectUnauthorized:false allows a secure connectctions, required by vercel?
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // a provider that lets users log in with an email and password (my DB,no Google or GitHub)
      name: "Credentials", // name:"Credentials" is just a label that shows up on the login page
      credentials: {
        // defines what fields the login form uses, so in this case the user will log in with email and password
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // checks if credentials exists, queries the database for the user with the specific email
      // returns the object if login successful, otherwise error
      async authorize(
        credentials: Record<string, string> | undefined
      ): Promise<User | null> {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing email or password.");
        const users = await sql`
          SELECT id, username, email, password_hash
          FROM users
          WHERE email = ${credentials.email};
        `;
        const user = users[0];

        if (!user) {
          throw new Error("User not found");
        }
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValid) throw new Error("Invalid password.");
        return { id: user.id, name: user.username, email: user.email };
      },
    }),
  ],
  // secret is used to sign JWT tokens, encrypt session cookies, validate sessions
  // critical for security
  secret:process.env.NEXTAUTH_SECRET,
  // JWT - json web tokens, tracks sessions
  // JWT are tokens that hold user info, sign with our nextauth_secret
  session: {
    strategy: "jwt" as const, // or 'database if i want a database sessions
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  // callbacks - hooks that allow me to modify JWT, session, redirects
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = Number(user.id); // add the user id to the token after login
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = Number(token.id); // attach userid to token so that the session can know which user is logged in. JWTs are unique per user.
      }
      return session;
      // now session.user has {id,name,email}
      // this is how the server and client know 
      // which user is logged in
    },
  },

  pages: {
    signIn: "/userLogin", // tells nextauth to use my own custom login page instead of the default one
  },
};

const handler = NextAuth(authOptions); // creates the API route handler
// Exporting as GET and POST means next js will handle both types of http requests
export { handler as GET, handler as POST };

// GET request: fetche session info or sign-in page
// POST request: login attempts, logout, callbacks