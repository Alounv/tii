import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import Header from "~/components/starter/header/header";
import { useAuthSession } from "./plugin@auth";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const userSignal = useAuthSession();
  const { user } = userSignal.value || {};

  return (
    <div class="min-h-full">
      <Header user={user} />
      <main>
        <div class="mx-auto max-w-4xl p-8">
          <div class="py-6 sm:px-6 lg:px-8 overflow-hidden bg-white shadow rounded-lg min-h-full">
            <Slot />
          </div>
        </div>
      </main>
    </div>
  );
});
