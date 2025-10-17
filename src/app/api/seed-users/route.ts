// adds some dummy users to my database
import postgres from "postgres"; // allows javascript to communicate with a postgresql database;
// you can run sql queries directly in JS using this library
import bcrypt from "bcrypt"

const sql = postgres(process.env.POSTGRES_URL!,{ssl:"require"});
// environment variable ( a secret outside your code ) that contains the database connection string
// typically looks like this : postgres://username:password@host:port/database
// the ! tells typescript that "i am sure this exists - it's a non null assertion"
// ssl: require = ensures SSl encryption

// Example users (optional: you can remove this and register users manually later)
const users = [
  { username: "peter", email: "peter@example.com", password: "Abc1234" }
];

async function seedUsers(){
    await sql`DROP TABLE IF EXISTS users`;

    await sql`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY,email TEXT UNIQUE NOT NULL, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())`;

    for (const user of users){
        const hashedPassword = await bcrypt.hash(user.password,10);
        await sql`INSERT INTO users(email,username,password_hash) VALUES(${user.email},${user.username},${hashedPassword}) ON CONFLICT (email) DO NOTHING`;
    }
}

export async function GET(){
    try{
        await seedUsers();
        return new Response(JSON.stringify({message:"Users seeded successfully"}),{status:200})
    }catch(error){
        console.log(error);
        return new Response(JSON.stringify({error:error.message}),{status:500})
    }
}