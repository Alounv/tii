import { component$ } from "@builder.io/qwik";
import { TiiLogo } from "../icons/tii";
import { useAuthSession, useAuthSignout } from "~/routes/plugin@auth";
import { Form } from "@builder.io/qwik-city";
import Profile from "../profile";

export default component$(() => {
  const logoutAction = useAuthSignout();
  const userSignal = useAuthSession();
  const { user } = userSignal.value || {};
  return (
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <a href="/" title="tii">
                <TiiLogo />
              </a>
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <a
                  href="https://github.com/Alounv/tii"
                  target="_blank"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                ></a>
                {user && (
                  <>
                    <div class="text-gray-300 rounded-md px-3 py-2 text-sm font-medium">
                      {user?.name}
                    </div>
                    <Form action={logoutAction}>
                      <button class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                        Logout
                      </button>
                    </Form>
                  </>
                )}
              </div>
            </div>
          </div>
          <Profile />
        </div>
      </div>
    </nav>
  );
});
