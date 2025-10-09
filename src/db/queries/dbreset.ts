import { db } from "..";
import { feed_follows, feeds, users } from "../../schema";
import { eq } from 'drizzle-orm';




export async function dbReset():Promise<void> {

    
    await db.delete(users)
    await db.delete(feeds)
    await db.delete(feed_follows)

    console.log("db reset successful")
}