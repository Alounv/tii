import { component$ } from "@builder.io/qwik";

import { Form } from "@builder.io/qwik-city";
import { useAuthSignin } from "~/routes/plugin@auth";

export const Login = component$(() => {
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
