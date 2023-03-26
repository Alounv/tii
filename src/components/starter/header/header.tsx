import { component$ } from "@builder.io/qwik";
import { TiiLogo } from "../icons/tii";
import Profile from "../profile";
import type { User } from "@prisma/client";

export default component$(({ user }: { user: User | null }) => {
  return (
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <a href="/" title="tii" class="flex items-center gap-3">
                <TiiLogo />
                <div class="text-white font-medium text-lg">This is it</div>
              </a>
            </div>
            <div class="ml-5 flex items-baseline space-x-4">
              <a
                href="https://github.com/Alounv/tii"
                target="_blank"
                class="text-gray-400 hover:bg-gray-700 hover:text-white rounded-md px-2 py-2 text-sm"
              >
                Github
              </a>
            </div>
          </div>

          {user && <Profile user={user} />}
        </div>
      </div>
    </nav>
  );
});
