import type { Success } from "@prisma/client";
import { prisma } from "~/server/db/client";
import { getIsTheSameDay } from "~/utilities/date";

export const setSuccess = async ({
  objectiveId,
  date,
  isDone,
}: Pick<Success, "objectiveId" | "date"> & { isDone: boolean }) => {
  const success = await prisma.success.findMany({
    where: { objectiveId },
    orderBy: { date: "desc" },
  });

  const currentSuccess = success.find((s) => getIsTheSameDay(s.date, date));

  if (currentSuccess && !isDone) {
    const success = await prisma.success.delete({
      where: { id: currentSuccess.id },
    });
    return success;
  }

  return prisma.success.create({
    data: { date, objectiveId },
  });
};
