import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { zod$ } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";

import Login from "~/components/login";
import Objective from "~/components/objective";
import Welcome from "~/components/welcome";
import {
  createObjective,
  deleteObjective,
  getObjectiveFromUser,
} from "~/data/objective";
import { setTodaySuccess } from "~/data/success";
import { getUserFromCookie } from "~/data/user";
import { useAuthSession } from "~/routes/plugin@auth";

export default component$(() => {
  const userSignal = useAuthSession();
  const { value: objective } = useGetUserObjective() || {};
  const createAction = useCreateObjective();
  const deleteAction = useDeleteObjective();
  const successAction = useToggleTodaySuccess();

  if (!userSignal.value?.user) {
    return <Login />;
  }

  if (!objective) {
    return <Welcome createAction={createAction} />;
  }

  return (
    <Objective
      objective={objective}
      deleteAction={deleteAction}
      successAction={successAction}
    />
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
    return getObjectiveFromUser({ userId: user.id });
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
  })
);

export const useToggleTodaySuccess = routeAction$(
  async ({ objectiveId, isDone }) => {
    await setTodaySuccess({ objectiveId, isDone });
    return { success: true };
  },
  zod$({
    objectiveId: z.string(),
    isDone: z.boolean(),
  })
);
