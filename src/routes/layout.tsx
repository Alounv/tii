import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import Header from "~/components/header/header";
import { getUserFromCookie } from "~/data/user";

export const useGetCurrentUser = routeLoader$(async ({ cookie }) => {
  return getUserFromCookie(cookie);
});

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const { value } = useGetCurrentUser();
  return (
    <div class="min-h-full">
      <Header user={value} />
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
