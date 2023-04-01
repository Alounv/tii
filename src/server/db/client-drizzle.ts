import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { z } from "zod";

const pool = new Pool({
  connectionString: z.string().nonempty().parse(import.meta.env.VITE_DATABASE_URL),
  ssl: true,
});

export const db = drizzle(pool);
