import { readConfigUrl } from "src/readconfig";
import { db } from "..";
import { feeds, users, feed_follows } from "../../schema";
import { getUserAndID, getUserByUUID } from "./getuser";
import { readConfig } from "src/config";
import { eq, ne } from 'drizzle-orm';




export async function createFeed(name: string, url: string, user_id: string): Promise<any> {

    const [result] = await db.insert(feeds).values({ url: url, name: name, user_id: user_id }).returning();

    return result;
}

export async function getFeeds(): Promise<any> {

    const result = await db.select({ feedName: feeds.name, feedURL: feeds.url, userName: users.name }).from(feeds).innerJoin(users, eq(feeds.user_id, users.id));
    console.log(`getfeed:`)

    return result;
}

export async function createFeedFollow(feed_id: string, user_id: string): Promise<any> {
    await db.insert(feed_follows).values({ feed_id: feed_id, user_id: user_id });
    const [newFeedFollow] = await db.select().from(feed_follows).innerJoin(users, eq(feed_follows.user_id, users.id)).innerJoin(feeds,eq(feed_follows.feed_id,feeds.id));

    return newFeedFollow
}

export async function getFeedFollows(user_id: string): Promise<any> {

    const newFeedFollow = await db.select().from(feed_follows).innerJoin(users, eq(feed_follows.user_id, users.id)).innerJoin(feeds, eq(feed_follows.feed_id, feeds.id));

    return newFeedFollow
}

export async function getFeedId(url: string): Promise<any> {

    const [feedId] = await db.select({id: feeds.id}).from(feeds).where(eq(feeds.url, url));

    return feedId.id
}
