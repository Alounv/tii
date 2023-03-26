import { component$ } from "@builder.io/qwik";
import { ActionStore, Form } from "@builder.io/qwik-city";
import { Objective } from "@prisma/client";

interface IObjective {
  objective: Objective;
  deleteAction: ActionStore<unknown, { objectiveId: string }, boolean>;
}

export default component$(({ objective, deleteAction }: IObjective) => {
  return (
    <div>
      <div>Objective created</div>
      <div>{JSON.stringify(objective)}</div>

      <Form action={deleteAction}>
        <input type="hidden" name="objectiveId" value={objective.id} />
        <button>Delete objective</button>
      </Form>
    </div>
  );
});
