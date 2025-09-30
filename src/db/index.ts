import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schema";
import { readConfigUrl } from "../readconfig";

const dbUrl = readConfigUrl();
const conn = postgres(dbUrl);

export const db = drizzle(conn, { schema });