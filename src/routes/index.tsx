import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { zod$ } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { DangerSection } from "~/components/danger";
import { Login } from "~/components/login";
import { ObjectiveSection } from "~/components/objective";
import { ProgressSection } from "~/components/progress";
import { RewardSection } from "~/components/reward";
import { Welcome } from "~/components/welcome";
import {
  createObjective,
  deleteObjective,
  getObjectiveWithSuccessFromUser,
  updateObjective,
} from "~/data/objective";
import { setSuccess } from "~/data/success";
import { getUserFromCookie } from "~/data/user";
import { useAuthSession } from "~/routes/plugin@auth";
import { getEncouragement } from "~/server/encouragement";

export default component$(() => {
  const userSignal = useAuthSession();
  const { value: objective } = useGetUserObjective() || {};

  if (!userSignal.value?.user) {
    return <Login />;
  }

  if (!objective) {
    return <Welcome />;
  }

  return (
    <div class="text-gray-600">
      <ObjectiveSection objective={objective} />
      <RewardSection objective={objective} />
      <ProgressSection objective={objective} />
      <DangerSection objectiveId={objective.id} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "This is it",
  meta: [
    {
      name: "description",
      content: "This app helps you to achieve your main temporary goal",
    },
  ],
};

export const useGetUserObjective = routeLoader$(async ({ cookie }) => {
  const user = await getUserFromCookie(cookie);
  if (user) {
    return getObjectiveWithSuccessFromUser({ userId: user.id });
  }
});

export const useGetUserEncouragement = routeLoader$(async ({ cookie }) => {
  try {
    const user = await getUserFromCookie(cookie);
    if (user) {
      const objective = await getObjectiveWithSuccessFromUser({
        userId: user.id,
      });
      if (objective) {
        const isEncouragementGenerated = cookie.get("encouragement");
        if (isEncouragementGenerated) return "";

        return await getEncouragement({ objective, user });
      }
    }
  } catch (e: any) {
    console.error(e);
    return `Sorry, there was an error. Please try again later. (${e.message})`;
  }
});

export const useCreateObjective = routeAction$(async (_, { cookie }) => {
  const user = await getUserFromCookie(cookie);
  if (!user) {
    return { success: false, error: "You must login to create an objective" };
  }
  const objective = await createObjective({ userId: user.id });
  return { success: true, objective };
});

export const useDeleteObjective = routeAction$(
  async ({ objectiveId }) => {
    await deleteObjective(objectiveId);
    return { success: true };
  },
  zod$({
    objectiveId: z.string(),
  }),
);

const objectiveEditSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  duration: z.string().optional(),
  daily_saving: z.string().optional(),
  coach: z.string().optional(),
  motivation: z.string().optional(),
  motivation_url: z.string().optional(),
});

export type ObjectiveEditSchema = z.infer<typeof objectiveEditSchema>;

export const useEditObjective = routeAction$(async (input) => {
  const { duration: stringDuration, daily_saving, ...rest } = input;

  const duration = stringDuration ? parseInt(stringDuration) : undefined;
  const cost = daily_saving
    ? parseInt(daily_saving) * (duration || 0)
    : undefined;

  await updateObjective({ duration, cost, ...rest });
  return { success: true };
}, zod$(objectiveEditSchema));

const setSuccessSchema = z.object({
  objectiveId: z.string(),
  isDone: z.boolean(),
  date: z.string(),
});

export type SetSuccessSchema = z.infer<typeof setSuccessSchema>;

export const useToggleTodaySuccess = routeAction$(
  async ({ objectiveId, isDone, date }) => {
    await setSuccess({ objectiveId, isDone, date: new Date(date) });
    return { success: true };
  },
  zod$(setSuccessSchema),
);
