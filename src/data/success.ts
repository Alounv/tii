import { getIsTheSameDay } from "~/utilities/date";

import { eq, desc } from "drizzle-orm/expressions";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";
import { db } from "~/server/db/client";
import { objectivesTable } from "./objective";

export const successTable = pgTable("Success", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").defaultNow().notNull(),
  objectiveId: text("objectiveId")
    .references(() => objectivesTable.id)
    .notNull(),
});

export type Success = InferModel<typeof successTable>;
export type NewSuccess = InferModel<typeof successTable, "insert">;

export const setSuccess = async ({
  objectiveId,
  date,
  isDone,
}: Pick<Success, "objectiveId" | "date"> & { isDone: boolean }) => {
  const success = await db
    .select()
    .from(successTable)
    .where(eq(successTable.objectiveId, objectiveId))
    .orderBy(desc(successTable.date));

  const currentSuccess = success.find((s) => getIsTheSameDay(s.date, date));

  if (currentSuccess && !isDone) {
    const success = await db
      .delete(successTable)
      .where(eq(successTable.id, currentSuccess.id))
      .returning();
    return success[0];
  }

  console.log("E", date, objectiveId);

  const inserted = await db
    .insert(successTable)
    .values({ date, objectiveId })
    .returning();

  return inserted[0];
};
