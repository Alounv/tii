import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import Counter from "~/components/starter/counter/counter";
import Infobox from "~/components/starter/infobox/infobox";
import Starter from "~/components/starter/next-steps/next-steps";
import { Form } from "@builder.io/qwik-city";
import { useAuthSignin } from "~/routes/plugin@auth";

export default component$(() => {
  const loginAction = useAuthSignin();

  return (
    <>
      <div>
        <Form action={loginAction}>
          <div class="container">
            <input type="hidden" name="provider" value="credentials" />
            <div class="login">
              <button>Login</button>
            </div>
          </div>
        </Form>
      </div>
      <div class="section bright">
        <div class="container center">
          <Starter />
        </div>
      </div>

      <div class="section">
        <div class="container center">
          <h3>
            You can <b>count</b> on me
          </h3>
          <Counter />
        </div>
      </div>

      <div class="section">
        <div class="container topics">
          <Infobox>
            <div q:slot="title" class="icon icon-cli">
              CLI Commands
            </div>
            <>
              <p>
                <code>npm run dev</code>
                <br />
                Starts the development server and watches for changes
              </p>
              <p>
                <code>npm run preview</code>
                <br />
                Creates production build and starts a server to preview it
              </p>
              <p>
                <code>npm run build</code>
                <br />
                Creates production build
              </p>
              <p>
                <code>npm run qwik add</code>
                <br />
                Runs the qwik CLI to add integrations
              </p>
            </>
          </Infobox>

          <div>
            <Infobox>
              <div q:slot="title" class="icon icon-apps">
                Example Apps
              </div>
              <p>
                Have a look at the <a href="/demo/flower">Flower App</a> or the{" "}
                <a href="/demo/todolist">Todo App</a>.
              </p>
            </Infobox>

            <Infobox>
              <div q:slot="title" class="icon icon-community">
                Community
              </div>
              <ul>
                <li>
                  <span>Questions or just want to say hi? </span>
                  <a href="https://qwik.builder.io/chat" target="_blank">
                    Chat on discord!
                  </a>
                </li>
                <li>
                  <span>Follow </span>
                  <a href="https://twitter.com/QwikDev" target="_blank">
                    @QwikDev
                  </a>
                  <span> on Twitter</span>
                </li>
                <li>
                  <span>Open issues and contribute on </span>
                  <a href="https://github.com/BuilderIO/qwik" target="_blank">
                    GitHub
                  </a>
                </li>
                <li>
                  <span>Watch </span>
                  <a href="https://qwik.builder.io/media/" target="_blank">
                    Presentations, Podcasts, Videos, etc.
                  </a>
                </li>
              </ul>
            </Infobox>
          </div>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
