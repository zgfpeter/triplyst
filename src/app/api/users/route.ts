import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL!, {ssl:{rejectUnauthorized:false}});

export async function POST(req:Request){
    try{
        const {username,email,password} = await req.json();

        if(!username || !email || !password){
            return new Response(JSON.stringify({error:"Missing fields"}),{status:400});
        }

        // check if user already exists
        const exists = await sql`SELECT * FROM users WHERE email = ${email}`;
        if(exists.length>0){
            return new Response(JSON.stringify({error:"User with this email already exists"}),{status:400});
        }

        // hash user password
        const hashed = await bcrypt.hash(password,10);
        
        //insert user into DB
        const result = await sql`INSERT INTO USERS (username,email,password_hash) VALUES(${username},${email},${hashed}) RETURNING id,username,email;`;

        return new Response(JSON.stringify(result[0]),{status:201});
    }catch(error){
        console.log("Error inserting new user into the database: ",error);
        return new Response(JSON.stringify({error:"Failed to register user"}),{status:500});
    }
}