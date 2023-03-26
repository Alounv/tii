import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import { Form } from "@builder.io/qwik-city";
import { getObjectiveFromUser } from "~/data/objective";
import { getUserFromCookie } from "~/data/user";
import { useAuthSignin } from "~/routes/plugin@auth";

export const useGetUserObjective = routeLoader$(async ({ cookie }) => {
  const user = await getUserFromCookie(cookie);
  if (user) {
    return getObjectiveFromUser({ userId: user.id });
  }
});

export default component$(() => {
  const loginAction = useAuthSignin();

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
});
