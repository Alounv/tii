import { component$ } from "@builder.io/qwik";
import { useServerTimeLoader } from "~/routes/layout";
import styles from "./footer.module.css";

export const Footer = component$(() => {
  const serverTime = useServerTimeLoader();

  return (
    <footer>
      <a
        href="https://github.com/Alounv/tii"
        target="_blank"
        class={styles.anchor}
      >
        Github
        <span class={styles.spacer}>|</span>
        <span>{serverTime.value.date}</span>
      </a>
    </footer>
  );
});
