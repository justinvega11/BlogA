import { db } from "..";
import { users } from "../../schema";
import { eq } from 'drizzle-orm';




export async function getUser(name: string):Promise<any> {

    
    const [result] = await db.select({ name: users.name, }).from(users).where(eq(users.name, name));
    console.log("getUseroutput:")
    console.log(result)

    
    return result;
}

export async function getUsers():Promise<any> {

    
    const result = await db.select({ name: users.name, }).from(users);
    console.log("getUseroutput:")
    console.log(result)

    
    return result;
}