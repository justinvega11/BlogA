import { setUser, readConfig } from "./config";
import { dbReset } from "./db/queries/dbreset";
import { getUser, getUsers } from "./db/queries/getuser";
import { createUser } from "./db/queries/users";
import { fetchFeed } from "./rss/xmlparse";

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
    console.log(xml )


}