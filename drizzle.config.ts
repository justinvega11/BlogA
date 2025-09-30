import { defineConfig } from "drizzle-kit";
import {readConfigUrl} from "./src/config"


export default defineConfig({
  schema: "src/schema.ts",
  out: "src/db",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfigUrl(),
  },
});