import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { z } from "zod";

const pool = new Pool({
  connectionString: z.string().nonempty().parse(import.meta.env.VITE_DATABASE_URL),
  ssl: true,
});

export const db = drizzle(pool);
