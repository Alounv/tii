import { Slot, component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import { Form } from "@builder.io/qwik-city";
import type { Objective } from "@prisma/client";

interface IObjective {
  objective: Objective;
  deleteAction: ActionStore<unknown, { objectiveId: string }, boolean>;
}

export default component$(({ objective, deleteAction }: IObjective) => {
  return (
    <div>
      <Section title="Objective">
        <h1 class="text-3xl font-bold">{objective.description}</h1>
      </Section>

      <Section title="Reward"></Section>

      <Section title="Progress"></Section>

      <Section title="Danger">
        <Form action={deleteAction}>
          <input type="hidden" name="objectiveId" value={objective.id} />
          <button>Delete objective</button>
        </Form>
      </Section>
    </div>
  );
});

interface ISection {
  title: string;
}

const Section = component$(({ title }: ISection) => {
  return (
    <div class="group overflow-hidden">
      <div class="text-sm leading-6 text-gray-400 mb-3">{title}</div>
      <Slot />
      <hr class="mt-6 mb-10 group-last:border-none group-last:mb-0" />
    </div>
  );
});
