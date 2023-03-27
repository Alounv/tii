import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import { Form } from "@builder.io/qwik-city";
import { useAuthSession } from "~/routes/plugin@auth";

interface IWelcome {
  createAction: ActionStore<unknown, {}, boolean>;
}

export default component$(({ createAction }: IWelcome) => {
  const userSignal = useAuthSession();
  const { user } = userSignal.value || {};

  return (
    <div class="flex flex-col items-center gap-3">
      <div>{`Welcome ${user.name}`}</div>
      <div>What is your main objective now?</div>
      <Form action={createAction}>
        <button class="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700">
          Créer mon objectif
        </button>
      </Form>
    </div>
  );
});
