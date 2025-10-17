// [...nextauth] is a special catch-all route used by NextAuth
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import postgres from "postgres";
import bcrypt from "bcrypt";
console.log("POSTRESQL_URL: ", process.env.POSTGRES_URL);
console.log("SECRET: ", process.env.AUTH_SECRET);
// connects to my postgresql database
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // a provider that lets users log in with an email and password (my DB,no Google or GitHub)
      name: "Credentials",
      credentials: {
        // defines what fields the login form uses, so in this case the user will log in with email and password
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        //   const users = await sql`SELECT * FROM users WHERE email = ${credentials.email}`;
        //   const user = users[0];
        //   if (!user) return null;

        //temp data
        const tempemail = "peter@example.com";
        const tempusername = "peter";
        const temppassword = "Abc12345";

        //const isValid = await bcrypt.compare(credentials.password, temppassword.password_hash);
        const isValid = credentials.password == temppassword;
        if (!isValid) return null;

        //return { id: tempuser.id, name: user.username, email: user.email };
        return { id: 1, name: tempusername, email: tempemail };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const, // or 'database if i want a database sessions
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },

  pages: {
    signIn: "/userLogin", // custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
