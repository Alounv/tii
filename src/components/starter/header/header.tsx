import { component$ } from "@builder.io/qwik";
import { TiiLogo } from "../icons/tii";
import styles from "./header.module.css";
import { useAuthSession, useAuthSignout } from "~/routes/plugin@auth";
import { Form } from "@builder.io/qwik-city";

export default component$(() => {
  const logoutAction = useAuthSignout();
  const userSignal = useAuthSession();
  const { user } = userSignal.value || {};
  return (
    <header class={styles.header}>
      <div class={styles.logo}>
        <a href="/" title="tii">
          <TiiLogo />
        </a>
      </div>
      {user && (
        <>
          <div>{user?.name}</div>
          <Form action={logoutAction}>
            <div class="container">
              <div class="login">
                <button>Logout</button>
              </div>
            </div>
          </Form>
        </>
      )}
    </header>
  );
});
