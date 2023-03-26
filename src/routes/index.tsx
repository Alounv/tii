import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";

import { Form } from "@builder.io/qwik-city";
import { useAuthSession, useAuthSignin } from "~/routes/plugin@auth";

export const useCreateObjective = routeAction$((data) => {
  console.log("create objective", data);
  return { success: true };
});

export default component$(() => {
  const loginAction = useAuthSignin();
  const userSignal = useAuthSession();
  const createObjectiveAction = useCreateObjective();
  const { user } = userSignal.value || {};

  return user ? (
    <div class="section bright">
      <div class="flex flex-col items-center gap-3">
        <div>{`Bienvenue ${user.name}`}</div>
        <div>What is your main objective now?</div>
        <Form action={createObjectiveAction}>
          <input type="hidden" name="userId" value={user.id} />
          <button class="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700">
            Créer mon objectif
          </button>
        </Form>
      </div>
    </div>
  ) : (
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
