import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import { Form } from "@builder.io/qwik-city";
import type { Objective, Success } from "@prisma/client";
import type { ObjectiveEditSchema } from "~/routes";
import { Editable } from "./editable";
import { Section } from "./section";

interface IObjectiveSection {
  objective: Objective & { success: Success[] };
  editAction: ActionStore<unknown, ObjectiveEditSchema, boolean>;
}

export const ObjectiveSection = component$(
  ({ objective, editAction }: IObjectiveSection) => {
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
            <div>
              Coached by:{" "}
              <Editable
                classes="font-medium text-gray-800 w-80"
                name="coach"
                value={coach}
              />
            </div>
            <div class="rounded-xl p-8 bg-gray-50 border italic mt-4 text-lg text-gray-900 text-center">
              <div class="text-gray-300">Encouragement is loading...</div>
            </div>
          </div>
        </Form>
      </Section>
    );
  }
);
