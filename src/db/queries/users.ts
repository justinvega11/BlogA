import { db } from "..";
import { users } from "../../schema";



export async function createUser(name: string):Promise<any> {

    
    const [result] = await db.insert(users).values({ name: name }).returning();


    return result;
}