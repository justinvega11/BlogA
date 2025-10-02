import { db } from "..";
import { users } from "../../schema";
import { eq } from 'drizzle-orm';




export async function dbReset():Promise<void> {

    
    await db.delete(users)
    console.log("db reset successful")
}