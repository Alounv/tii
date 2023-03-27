import type { Success } from "@prisma/client";
import { prisma } from "~/server/db/client";

export const setTodaySuccess = async ({
  objectiveId,
  isDone,
}: Pick<Success, "objectiveId"> & { isDone: boolean }) => {
  const date = new Date();
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const todaySuccess = await prisma.success.findMany({
    where: { objectiveId, date: { gte: startOfDay } },
    select: { id: true },
  });

  const ids = todaySuccess.map((s) => s.id);

  if (ids.length && !isDone) {
    const success = await prisma.success.deleteMany({
      where: { id: { in: ids } },
    });
    return success;
  }

  const success = await prisma.success.create({
    data: { date, objectiveId },
  });
  return success;
};
