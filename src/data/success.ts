import { getIsTheSameDay } from "~/utilities/date";
import { eq, desc } from "drizzle-orm/expressions";
import { db } from "~/server/db/client";
import type { NewSuccess } from "~/server/db/schema";
import { successTable } from "~/server/db/schema";

export const setSuccess = async ({
  objectiveId,
  date,
  isDone,
}: NewSuccess & { isDone: boolean }) => {
  const success = await db
    .select()
    .from(successTable)
    .where(eq(successTable.objectiveId, objectiveId))
    .orderBy(desc(successTable.date));

  const currentSuccess = success.find(
    (s) => date && getIsTheSameDay(s.date, date),
  );

  if (currentSuccess && !isDone) {
    const success = await db
      .delete(successTable)
      .where(eq(successTable.id, currentSuccess.id))
      .returning();
    return success[0];
  }

  const inserted = await db
    .insert(successTable)
    .values({ date, objectiveId })
    .returning();

  return inserted[0];
};
