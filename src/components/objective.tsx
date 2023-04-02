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
import type { Objective } from "~/data/objective";
import type { Success } from "~/data/success";
import { useGetCurrentUser } from "~/routes/layout";
import { getTextCompletion } from "~/utilities/encouragement";

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
    const refreshEncouragement = useContext(RefreshEncouragementContext);

    const encouragementResource = useResource$<string>(async ({ track }) => {
      track(() => refreshEncouragement.value);
      if (user) {
        const prompt = getPrompt({ objective, name: user.name || "User" });

        console.log("BEFORE");
        return getTextCompletion(prompt);
      }
      return "User undefined";
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
                  refreshEncouragement.value = !refreshEncouragement.value;
                }}
              >
                new encouragement
              </button>
            </div>
            <div class="rounded-xl p-8 bg-gray-50 border italic mt-2 text-lg text-gray-900 text-center">
              <Resource
                value={encouragementResource}
                onPending={() => <div class="text-gray-300">Loading...</div>}
                onRejected={(e) => (
                  <div class="text-gray-300">{`Error: ${e}`}</div>
                )}
                onResolved={(e) => (
                  <div class="text-sky-700 text-2xl font-semibold opacity-80">
                    {e}
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
