import { eq } from "drizzle-orm/expressions";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";
import { db } from "~/server/db/client";
import { usersTable } from "./user";
import { successTable } from "./success";

const defaultObjective: Omit<Objective, "userId" | "id"> = {
  description: "Go to bed at 11pm",
  duration: 21,
  cost: 210,
  coach: "Tyrion Lannister",
  motivation: "A week-end with friends in the mountains",
  motivation_url:
    "https://www.mthigh.com/site/mountain/mountain-info/camping/northlodge/IMG_8056/stack-promo--xl",
};

export const objectivesTable = pgTable("Objective", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .references(() => usersTable.id)
    .notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  cost: integer("cost").notNull(),
  coach: text("coach").notNull(),
  motivation: text("motivation").notNull(),
  motivation_url: text("motivation_url").notNull(),
});

export type Objective = InferModel<typeof objectivesTable>;
export type NewObjective = InferModel<typeof objectivesTable, "insert">;

export const createObjective = async ({
  userId,
}: Pick<Objective, "userId">) => {
  const inserted = await db
    .insert(objectivesTable)
    .values({ ...defaultObjective, userId })
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
