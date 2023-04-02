import { eq } from "drizzle-orm/expressions";
import { db } from "~/server/db/client";
import type { NewObjective, Objective } from "~/server/db/schema";
import { successTable } from "~/server/db/schema";
import { objectivesTable } from "~/server/db/schema";

const defaultObjective: Omit<Objective, "userId" | "id"> = {
  description: "Go to bed at 11pm",
  duration: 21,
  cost: 210,
  coach: "Tyrion Lannister",
  motivation: "A week-end with friends in the mountains",
  motivation_url:
    "https://www.mthigh.com/site/mountain/mountain-info/camping/northlodge/IMG_8056/stack-promo--xl",
};

export const createObjective = async ({
  userId,
}: Pick<Objective, "userId">) => {
  const newObjective: NewObjective = { ...defaultObjective, userId };
  const inserted = await db
    .insert(objectivesTable)
    .values(newObjective)
    .returning();
  return inserted[0];
};

export const updateObjective = async (
  partialObjective: Partial<Objective> & { id: string },
) => {
  const updated = await db
    .update(objectivesTable)
    .set(partialObjective)
    .where(eq(objectivesTable.id, partialObjective.id))
    .returning();
  return updated[0];
};

export const getObjectiveWithSuccessFromUser = async ({
  userId,
}: Pick<Objective, "userId">) => {
  const objectives = await db
    .select()
    .from(objectivesTable)
    .where(eq(objectivesTable.userId, userId));

  const objective = objectives[0];
  const success = await db
    .select()
    .from(successTable)
    .where(eq(successTable.objectiveId, objective.id));

  return { ...objective, success };
};

export const deleteObjective = async (id: string) => {
  return db.delete(objectivesTable).where(eq(objectivesTable.id, id));
};
