import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Editable } from "./editable";
import { Section } from "./section";
import { eraseCookie, setCookie } from "~/utilities/cookie";
import { useEditObjective, useGetUserEncouragement } from "~/routes";
import type { Objective } from "~/data/objective";
import type { Success } from "~/data/success";

interface IObjectiveSection {
  objective: Objective & { success: Success[] };
}

export const ObjectiveSection = component$(
  ({ objective }: IObjectiveSection) => {
    const { value: encouragementValue } = useGetUserEncouragement() || {};
    const editAction = useEditObjective();
    const encouragement = useSignal<string>("");

    useVisibleTask$(({ track }) => {
      try {
        track(() => encouragementValue);
        if (encouragementValue) {
          sessionStorage.setItem("encouragement", encouragementValue);
          setCookie("encouragement", "true", 1);
          encouragement.value = encouragementValue;
        } else {
          encouragement.value = sessionStorage.getItem("encouragement") || "";
          if (!encouragement.value) {
            eraseCookie("encouragement");
          }
        }
      } catch (e) {
        console.error(e);
        encouragement.value =
          "Sorry, there was an error. Please try again later.";
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
                  eraseCookie("encouragement");
                  location.reload();
                }}
              >
                new encouragement
              </button>
            </div>
            <div class="rounded-xl p-8 bg-gray-50 border italic mt-2 text-lg text-gray-900 text-center">
              <div
                class={
                  encouragement
                    ? "text-sky-700 text-2xl font-semibold opacity-80"
                    : "text-gray-300"
                }
              >
                {encouragement || "Encouragement is loading..."}
              </div>
            </div>
          </div>
        </Form>
      </Section>
    );
  },
);
