import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import { Form } from "@builder.io/qwik-city";
import { Section } from "./section";

interface IDangerSection {
  objectiveId: string;
  deleteAction: ActionStore<unknown, { objectiveId: string }, boolean>;
}

export const DangerSection = component$(
  ({ objectiveId, deleteAction }: IDangerSection) => {
    return (
      <Section title="Danger">
        <details class="rounded-lg bg-gray-50 p-6">
          <summary class="text-sm text-gray-400 cursor-pointer">open</summary>
          <Form
            action={deleteAction}
            class="flex mb-4 items-center justify-center gap-4"
          >
            <input type="hidden" name="objectiveId" value={objectiveId} />

            <button class="rounded-lg text-sm font-semibold py-2.5 px-4 bg-red-600 text-white hover:bg-red-700">
              Delete objective
            </button>
            <div class="text-sm text-red-400">⚠️ cannot not be reversed</div>
          </Form>
        </details>
      </Section>
    );
  }
);
