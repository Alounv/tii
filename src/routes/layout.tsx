import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import Header from "~/components/starter/header/header";
import Footer from "~/components/starter/footer/footer";
import { useAuthSession } from "~/routes/plugin@auth";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const userSignal = useAuthSession();
  console.log("userSignal", userSignal);

  return (
    <div class="page">
      <main>
        <Header />
        <Slot />
      </main>
      <div class="section dark">
        <div class="container">
          <Footer />
        </div>
      </div>
    </div>
  );
});
