import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";

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


export const successTable = pgTable("Success", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").defaultNow().notNull(),
  objectiveId: text("objectiveId")
    .references(() => objectivesTable.id)
    .notNull(),
});

export type Success = InferModel<typeof successTable>;
export type NewSuccess = InferModel<typeof successTable, "insert">;

export const usersTable = pgTable("User", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  name: text("name"),
  avatar_url: text("avatar_url"),
});

export type User = InferModel<typeof usersTable>;
export type NewUser = InferModel<typeof usersTable, "insert">;
