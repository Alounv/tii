import { component$, useSignal, $, useOnDocument } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { zUser } from "~/data/user";
import { useAuthSignout } from "~/routes/plugin@auth";

export default component$(({ user }: { user: string }) => {
  const useMenu = useSignal(false);
  const logoutAction = useAuthSignout();

  if (!user) return null;
  const { image } = zUser.parse(user);

  useOnDocument(
    "click",
    $(async (event) => {
      const elem = document.getElementById("user-menu");
      if (elem) {
        if (!elem.contains(event.target as Node)) {
          useMenu.value = false;
        }
      }
    })
  );

  return (
    <div>
      <div class="hidden md:block">
        <div class="ml-4 flex items-center md:ml-6">
          <div class="relative ml-3">
            <div>
              <button
                type="button"
                class="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                onClick$={() => {
                  useMenu.value = true;
                }}
              >
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" src={image} alt="" />
              </button>
            </div>

            <div
              id="user-menu"
              class={`${
                useMenu.value ? "" : "hidden"
              } absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex={-1}
            >
              <Form action={logoutAction}>
                <button
                  class="text-left w-full px-4 py-2 text-sm font-medium text-gray-700"
                  role="menuitem"
                  tabIndex={-1}
                  id="user-menu-item-2"
                >
                  Sign out
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <div class="-mr-2 flex md:hidden">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="block h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <svg
            class="hidden h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});
