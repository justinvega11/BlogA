import { setUser } from "./config";
import { getUser } from "./db/queries/getuser";
import { createUser } from "./db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const userName = args[0];

  const userCheck = await getUser(userName);
  if (userCheck && userCheck.name) {
    setUser(userName);
    console.log("User switched successfully!");
  }else{
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