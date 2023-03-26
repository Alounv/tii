import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { zod$ } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";

import { Form } from "@builder.io/qwik-city";
import {
  createObjective,
  deleteObjective,
  getObjectiveFromUser,
} from "~/data/objective";
import { getUserFromCookie } from "~/data/user";
import { useAuthSession, useAuthSignin } from "~/routes/plugin@auth";

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

export const useGetUserObjective = routeLoader$(async ({ cookie }) => {
  const user = await getUserFromCookie(cookie);
  if (user) {
    return getObjectiveFromUser({ userId: user.id });
  }
});

export default component$(() => {
  const loginAction = useAuthSignin();
  const userSignal = useAuthSession();
  const createObjectiveAction = useCreateObjective();
  const deleteObjectiveAction = useDeleteObjective();
  const { user } = userSignal.value || {};
  const { value: objective } = useGetUserObjective() || {};

  if (!user) {
    return (
      <div>
        <div>You must login (with a github account) to create an objective</div>
        <Form action={loginAction}>
          <div class="container">
            <input type="hidden" name="providerId" value="github" />
            <div class="login">
              <button>Login</button>
            </div>
          </div>
        </Form>
      </div>
    );
  }

  if (!objective) {
    return (
      <div class="section bright">
        <div class="flex flex-col items-center gap-3">
          <div>{`Bienvenue ${user.name}`}</div>
          <div>What is your main objective now?</div>
          <Form action={createObjectiveAction}>
            <button class="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700">
              Créer mon objectif
            </button>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>Objective created</div>
      <div>{JSON.stringify(objective)}</div>

      <Form action={deleteObjectiveAction}>
        <input type="hidden" name="objectiveId" value={objective.id} />
        <button>Delete objective</button>
      </Form>
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
