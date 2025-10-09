import { defineConfig } from "drizzle-kit";
import {readConfigUrl} from "./src/readconfig"

const url = readConfigUrl();
console.log("Drizzle URL:", url);

export default defineConfig({
  schema: "src/schema.ts",
  out: "src/db",
  dialect: "postgresql",
  dbCredentials: {
    url: url,
  },
});