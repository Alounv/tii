import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import { Form } from "@builder.io/qwik-city";
import type { Objective, Success } from "@prisma/client";
import type { ObjectiveEditSchema } from "~/routes";
import { Editable } from "./editable";
import { Section } from "./section";

interface IRewardSection {
  objective: Objective & { success: Success[] };
  editAction: ActionStore<unknown, ObjectiveEditSchema, boolean>;
}

export const RewardSection = component$(
  ({ objective, editAction }: IRewardSection) => {
    const { motivation, motivation_url, duration, cost, success } = objective;

    const progress = success.length / duration;

    return (
      <Section title="Reward">
        <Form action={editAction} class="flex">
          <input type="hidden" name="id" value={objective.id} />
          <div class="w-1/2 flex flex-col gap-6 items-center justify-center">
            <div class="text-5xl">{`${Math.round(cost * progress)} €`}</div>
            <div class="text-gray-400">{`already saved (${Math.round(
              progress * 100
            )} %)`}</div>
          </div>

          <div class="flex flex-col flex-1 p-2 items-center">
            <div class="mb-4">
              <Editable
                rows={3}
                classes="text-lg font-medium mb-4 text-gray-800"
                name="motivation"
                value={motivation}
              />
              <span class="text-gray-400 text-sm">{` (${cost} €)`}</span>
            </div>
            <div class="rounded-xl shadow drop-shadow-lg p-4 bg-gray-50 overflow-hidden mb-2">
              <img class="rounded-md" src={motivation_url} alt={motivation} />
              <div class="absolute top-0 bottom-0 left-0 right-0 opacity-25 bg-white" />
            </div>
            <Editable
              rows={4}
              classes="text-sm rounded text-gray-400"
              label="change URL"
              name="motivation_url"
              value={motivation_url}
            />
          </div>
        </Form>
      </Section>
    );
  }
);
