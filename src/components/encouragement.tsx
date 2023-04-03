import {
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Editable } from "./editable";
import { RefreshEncouragementContext, useEditObjective } from "~/routes";
import { useGetCurrentUser } from "~/routes/layout";
import type { Objective, Success } from "~/server/db/schema";

const decoder = new TextDecoder();

interface IEncouragement {
  objective: Objective & { success: Success[] };
}

export const Encouragement = component$(({ objective }: IEncouragement) => {
  const { value: user } = useGetCurrentUser();
  const editAction = useEditObjective();
  const refresh = useContext(RefreshEncouragementContext);
  const encouragementRef = useSignal<HTMLElement>();

  useVisibleTask$(async ({ track }) => {
    track(refresh);

    if (!user) return;
    const { coach, description, duration, motivation, success } =
      objective || {};

    const response = await fetch("/api/encouragement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        objective: { coach, description, duration, motivation },
        successCount: success.length,
        name: user.name,
      }),
    });

    const { body } = response;
    if (!body) return;

    const reader = body.getReader();

    encouragementRef.value!.textContent = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      encouragementRef.value!.textContent =
        encouragementRef.value?.textContent + text;
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
            class="rounded-lg text-white bg-sky-600 text-sm py-1 px-2 hover:bg-sky-500 shadow hover:shadow-none"
            onClick$={() => {
              refresh.value = !refresh.value;
            }}
          >
            new encouragement
          </button>
        </div>
        <div class="rounded-xl p-2 sm:p-8 bg-gray-50 border mt-2 text-lg ">
          <div
            ref={encouragementRef}
            class="text-grey-700 text-2xl font-medium opacity-80 text-sky-700"
          >
            {"Loading..."}
          </div>
        </div>
      </div>
    </Form>
  );
});
