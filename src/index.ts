import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands";
import { handlerLogin, handlerRegister } from "./usercommands";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  await registerCommand(commandsRegistry, "login", handlerLogin);
  console.log("login registered")
  await registerCommand(commandsRegistry,"register", handlerRegister)
   console.log("register registered")

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0)
}

main();
