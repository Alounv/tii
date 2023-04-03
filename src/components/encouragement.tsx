import {
  Resource,
  component$,
  useContext,
  useResource$,
} from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Editable } from "./editable";
import { RefreshEncouragementContext, useEditObjective } from "~/routes";
import { useGetCurrentUser } from "~/routes/layout";
import { getEncouragement } from "~/utilities/encouragement";
import type { Objective, Success } from "~/server/db/schema";

interface IEncouragement {
  objective: Objective & { success: Success[] };
}

export const Encouragement = component$(({ objective }: IEncouragement) => {
  const { value: user } = useGetCurrentUser();
  const editAction = useEditObjective();
  const refresh = useContext(RefreshEncouragementContext);

  const encouragementResource = useResource$<string>(async ({ track }) => {
    track(() => refresh.value);
    try {
      if (user) {
        return await getEncouragement({
          objective,
          name: user?.name || "user",
        });
      }
      return "User undefined";
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  return (
    <Form action={editAction} class="flex flex-col">
      <input type="hidden" name="id" value={objective.id} />
      <div class="mt-12">
        <div class="flex flex-wrap gap-2 items-center">
          <div class="flex-shrink-0">Coached by: </div>
          <Editable
            classes="font-medium text-gray-800 w-80 flex-shrink-0"
            name="coach"
            value={objective.coach}
          />
          <div class="flex-grow" />
          <button
            class="rounded-lg text-gray-400 text-sm py-1 px-2 hover:bg-grey-200 border"
            onClick$={() => {
              refresh.value = !refresh.value;
            }}
          >
            new encouragement
          </button>
        </div>
        <div class="rounded-xl p-2 sm:p-8 bg-gray-50 border italic mt-2 text-lg text-gray-900 text-center">
          <Resource
            value={encouragementResource}
            onPending={() => <div class="text-gray-300">Loading...</div>}
            onRejected={(error) => {
              console.error(error);
              return (
                <button
                  class="text-grey-700 text-2xl font-semibold opacity-80"
                  onClick$={() => {
                    refresh.value = !refresh.value;
                  }}
                >
                  Ask for encouragement
                </button>
              );
            }}
            onResolved={(encouragement) => (
              <div class="text-sky-700 text-2xl font-semibold opacity-80">
                {encouragement}
              </div>
            )}
          />
        </div>
      </div>
    </Form>
  );
});
