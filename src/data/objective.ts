import type { Objective } from "@prisma/client";
import { prisma } from "~/server/db/client";

const defaultObjective: Omit<Objective, "userId" | "user" | "id"> = {
  description: "Go to bed at 11pm",
  duration: 21,
  cost: 210,
  coach: "Mark Watney (The Martian)",
  motivation: "A week-end with friends in the mountains",
  motivation_url:
    "https://www.mthigh.com/site/mountain/mountain-info/camping/northlodge/IMG_8056/stack-promo--xl",
};

export const createObjective = async ({
  userId,
}: Pick<Objective, "userId">) => {
  const objective = await prisma.objective.create({
    data: { ...defaultObjective, userId },
  });
  return objective;
};

export const getObjectiveFromUser = async ({
  userId,
}: Pick<Objective, "userId">) => {
  return prisma.objective.findFirst({ where: { userId } });
};

export const deleteObjective = async (id: string) => {
  return prisma.objective.delete({ where: { id } });
};
