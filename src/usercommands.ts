import { setUser, readConfig } from "./config";
import { dbReset } from "./db/queries/dbreset";
import { createFeed, createFeedFollow, getFeedFollows, getFeedId, getFeeds } from "./db/queries/feeds";
import { getUser, getUserAndID, getUsers } from "./db/queries/getuser";
import { createUser } from "./db/queries/users";
import { fetchFeed } from "./rss/xmlparse";
import { Feed, User } from "./schema";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const userName = args[0];

  const userCheck = await getUser(userName);
  if (userCheck && userCheck.name) {
    setUser(userName);
    console.log("User switched successfully!");
  } else {
    throw new Error(`User not found, please register`);
  }


}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const userName = args[0];

  try {
    console.time("getUser");
    const userCheck = await getUser(userName);
    console.timeEnd("getUser");
    console.log("After get User", userCheck);

    if (userCheck && userCheck.name) {
      throw new Error("user is already registered")
    }

    setUser(userName)

    if (await createUser(userName)) {
      console.log("User successfully registered!");
    }
    console.log(`${userName} user has been created.`)
  } catch (e) {
    console.error("getUser failed:", e);
    throw e;
  }

}

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {

  try {
    const userCheck = await dbReset();

  } catch (e) {
    console.error("db reset failed:", e);
    throw e;
  }

}

export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {


  try {
    const currentUser = readConfig().currentUserName
    const users = await getUsers();
    console.log("currentUser output")
    console.log(users)


    for (let user of users) {
      if (user.name === currentUser) {
        console.log(`*${user.name} (current)`)
      } else {
        console.log(`*${user.name}`)
      }
    }



  } catch (e) {
    console.error("db reset failed:", e);
    throw e;
  }

}

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {


  const xml = await fetchFeed("https://www.wagslane.dev/index.xml")
  console.log(xml)


}
export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {

  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed name> <feed url>`);
  }
  try {
    const currentUserName = readConfig()
    const currentUser: User = await getUserAndID(currentUserName.currentUserName)
    const currentFeed: Feed = await createFeed(args[0], args[1], currentUser.id)
    helperPrintFeed(currentFeed, currentUser)
    const currentFeedFollow = await createFeedFollow(currentFeed.id,currentUser.id)
    console.log(`debug: addFeed: Feed Name ${currentFeedFollow.feeds.name}.  Current user: ${currentFeedFollow.users.name} `)

  } catch (e) {
    console.error("db reset failed:", e);
    throw e;
  }

}
export async function handlerFeeds(cmdName: string, ...args: string[]): Promise<void> {

  try {
    const Feeds = await getFeeds()

    for (let feed of Feeds) {
      console.log("----------------------------------------")
      console.log(`Name: ${feed.feedName}`)
      console.log(`URL: ${feed.feedURL}`)
      console.log(`Username: ${feed.userName}`)

    }

  } catch (e) {
    console.error("db getFeeds failed:", e);
    throw e;
  }

}

function helperPrintFeed(feed: Feed, user: User): void {
  console.log(feed)
  console.log(user)
}

export async function handlerFollow(cmdName: string, ...args: string[]): Promise<void> {

  try {
    if (args.length !== 1) {
      throw new Error(`usage: ${cmdName} <Feed URL>`);
    }
    const currentUserName = readConfig()
    const currentUser: User = await getUserAndID(currentUserName.currentUserName)
    const feedID = await getFeedId(args[0])
    const result = await createFeedFollow(feedID, currentUser.id)
    console.log(`Followed Feed:${result.feeds.name}.  Followed by: ${result.users.name}`)

  } catch (e) {
    console.error("db getFeeds failed:", e);
    throw e;
  }
}


export async function handlerGetFeedFollowsForUser(cmdName: string, ...args: string[]): Promise<void> {

  try {

    const currentUserName = readConfig()
    const currentUser: User = await getUserAndID(currentUserName.currentUserName)
    const Feeds = await getFeedFollows(currentUser.id)

    for (let feed of Feeds) {
      console.log(`debugingging following:`)
      if(feed.feed_follows.user_id !== currentUser.id){
        continue
      }
      console.log("----------------------------------------")
      console.log(`Feed name: ${feed.feeds.name}`)


    }

  } catch (e) {
    console.error("db getFeeds failed:", e);
    throw e;
  }

}

