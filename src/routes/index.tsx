import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import { Form } from "@builder.io/qwik-city";
import { useAuthSession, useAuthSignin } from "~/routes/plugin@auth";

export default component$(() => {
  const loginAction = useAuthSignin();
  const userSignal = useAuthSession();
  const { user } = userSignal.value || {};

  return user ? (
    <div class="section bright">
      <div class="container center">
        <div>{`Bienvenue ${user.name}`}</div>
        <div>Dis-moi, quel est l'objectif qui te tiens le plus à coeur ?</div>
      </div>
    </div>
  ) : (
    <div>
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
