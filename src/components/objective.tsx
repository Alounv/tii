import {
  Resource,
  component$,
  useContext,
  useResource$,
} from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Editable } from "./editable";
import { Section } from "./section";
import { RefreshEncouragementContext, useEditObjective } from "~/routes";
import { useGetCurrentUser } from "~/routes/layout";
import { getEncouragement } from "~/utilities/encouragement";
import type { Objective, Success } from "~/server/db/schema";

export const getPrompt = ({
  objective,
  name,
}: {
  objective: Pick<
    Objective,
    "coach" | "duration" | "description" | "motivation"
  > & { success: Success[] };
  name: string;
}): string => {
  const successCount = objective.success.length;

  return `
  Imagine ${objective.coach} is encouraging ${name} 
  to pursue his goal of ${objective.description} for ${objective.duration} days 
  in order to afford ${objective.motivation}.
  It has lasted ${successCount} days already.
  The style of ${objective.coach} must be recognizable and it must be funny.
  `;
};

interface IObjectiveSection {
  objective: Objective & { success: Success[] };
}

export const ObjectiveSection = component$(
  ({ objective }: IObjectiveSection) => {
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

    const { description, coach, duration, cost } = objective;

    const dailySaving = Math.round(cost / duration);

    return (
      <Section title="Objective">
        <Form action={editAction} class="flex flex-col">
          <input type="hidden" name="id" value={objective.id} />
          <Editable
            classes="text-4xl font-bold text-gray-800"
            name="description"
            value={description}
          />
          <div class="mt-6">
            <span class="text-lg">
              For{" "}
              <Editable
                classes="font-medium text-gray-800 pl-1"
                name="duration"
                type="number"
                value={duration.toString()}
              />{" "}
              days, save{" "}
              <Editable
                classes="font-medium text-gray-800 pl-1"
                type="number"
                name="daily_saving"
                value={dailySaving.toString()}
              />{" "}
              € on each success.
            </span>
          </div>

          <div class="mt-12">
            <div class="flex gap-2 items-center">
              Coached by:{" "}
              <Editable
                classes="font-medium text-gray-800 w-80 flex-shrink-0"
                name="coach"
                value={coach}
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
            <div class="rounded-xl p-8 bg-gray-50 border italic mt-2 text-lg text-gray-900 text-center">
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
      </Section>
    );
  },
);
