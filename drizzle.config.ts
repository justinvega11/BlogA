import { defineConfig } from "drizzle-kit";
import {readConfigUrl} from "/home/justin/BlogA/src/config"


export default defineConfig({
  schema: "src/schema.ts",
  out: "src/db",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfigUrl(),
  },
});