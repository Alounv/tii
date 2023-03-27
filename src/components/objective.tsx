import { Slot, component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import { Form } from "@builder.io/qwik-city";
import { Success } from "@prisma/client";
import type { Objective } from "@prisma/client";

interface IObjective {
  objective: Objective & { success: Success[] };
  deleteAction: ActionStore<unknown, { objectiveId: string }, boolean>;
  successAction: ActionStore<
    unknown,
    { objectiveId: string; isDone: boolean },
    boolean
  >;
}

export default component$(
  ({ objective, deleteAction, successAction }: IObjective) => {
    const {
      description,
      motivation,
      motivation_url,
      coach,
      duration,
      cost,
      success,
    } = objective;

    const dailySaving = Math.round(cost / duration);
    const progress = success.length / duration;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySuccess = success.find(
      (s) => s.date.getTime() > today.getTime()
    );

    const successPassed = success.map((s) => ({ ...s, isPassed: true }));
    successPassed.sort((a, b) => a.date.getTime() - b.date.getTime());
    if (todaySuccess) {
      successPassed.pop();
    }

    const remainingDays = duration - success.length - (todaySuccess ? 0 : 1);

    const successToCome = new Array(remainingDays).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + 1 + i);
      return {
        date,
        id: `future-${i}`,
        isPassed: false,
      };
    });

    const checkboxes: (Pick<Success, "date" | "id"> & { isPassed: boolean })[] =
      [
        ...successPassed,
        {
          id: "today",
          date: today,
          ...todaySuccess,
          isPassed: todaySuccess ? true : false,
        },
        ...successToCome,
      ];

    return (
      <div class="text-gray-600">
        <Section title="Objective">
          <Editable
            classes="text-4xl font-bold text-gray-800"
            value={description}
          />
          <div class="mt-6">
            <span class="text-lg">
              For{" "}
              <Editable
                classes="font-medium text-gray-800 pl-1"
                value={duration}
              />{" "}
              days, save{" "}
              <Editable
                classes="font-medium text-gray-800 pl-1"
                value={dailySaving}
              />{" "}
              € on each success.
            </span>
          </div>

          <div class="mt-12">
            <div>
              Coached by:{" "}
              <Editable
                classes="font-medium text-gray-800 w-80"
                value={coach}
              />
            </div>
            <div class="rounded-xl p-8 bg-gray-50 border italic mt-4 text-lg text-gray-900 text-center">
              <div class="text-gray-300">Encouragement is loading...</div>
            </div>
          </div>
        </Section>

        <Section title="Reward">
          <div class="flex">
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
                value={motivation_url}
              />
            </div>
          </div>
        </Section>

        <Section title="Progress">
          <div class="p-6 flex gap-4 flex-wrap">
            {checkboxes.map((s) => {
              const isToday = s.date.getDate() === today.getDate();
              return (
                <Success
                  key={s.id}
                  isPassed={s.isPassed}
                  date={s.date}
                  objectiveId={objective.id}
                  successAction={isToday ? successAction : undefined}
                />
              );
            })}
          </div>
        </Section>

        <Section title="Danger">
          <details class="rounded-lg bg-gray-50 p-6">
            <summary class="text-sm text-gray-400 cursor-pointer">open</summary>
            <Form
              action={deleteAction}
              class="flex mb-4 items-center justify-center gap-4"
            >
              <input type="hidden" name="objectiveId" value={objective.id} />

              <button class="rounded-lg text-sm font-semibold py-2.5 px-4 bg-red-600 text-white hover:bg-red-700">
                Delete objective
              </button>
              <div class="text-sm text-red-400">⚠️ cannot not be reversed</div>
            </Form>
          </details>
        </Section>
      </div>
    );
  }
);

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

interface ISuccess {
  isPassed: boolean;
  date: Date;
  objectiveId: string;
  successAction?: ActionStore<
    unknown,
    { objectiveId: string; isDone: boolean },
    boolean
  >;
}

const Success = component$(
  ({ isPassed, date, successAction, objectiveId }: ISuccess) => {
    const formattedDate = `${date.getDate()} / ${date.getMonth()}`;
    return (
      <div class="flex-shrink-0 flex flex-col items-center gap-2">
        <label class="text-sm text-gray-400 cursor-pointer" for="today">
          {formattedDate}
        </label>
        <input
          id="today"
          type="checkbox"
          disabled={!successAction}
          checked={isPassed}
          class={`h-8 w-8 rounded border-gray-300 text-sky-600 focus:ring-sky-600 disabled:opacity-50`}
          onChange$={async (event) => {
            // eslint-disable-next-line qwik/valid-lexical-scope
            await successAction?.submit({
              objectiveId,
              isDone: event.target.checked,
            });
          }}
        />
      </div>
    );
  }
);

const Editable = component$(({ value, classes, rows, label }: any) => {
  const useIsEditable = useSignal(false);
  const inputRef = useSignal<HTMLInputElement>();

  useTask$(({ track }) => {
    track(() => useIsEditable.value);
    setTimeout(() => {
      const input = inputRef.value;
      input?.focus();
    }, 50);
  });

  if (useIsEditable.value) {
    const cls =
      classes +
      " border border-gray-400 rounded px-2" +
      (rows ? " resize-none w-full" : " ");
    const Element = rows ? "textarea" : "input";
    return (
      <Element
        ref={inputRef}
        class={cls}
        value={value}
        rows={rows}
        onChange$={() => {
          console.log("change");
        }}
        onBlur$={() => {
          useIsEditable.value = false;
        }}
      />
    );
  }

  return (
    <span
      class={
        classes +
        " cursor-pointer hover:bg-gray-100 hover:border-b border-gray-300 rounded"
      }
      onClick$={() => {
        useIsEditable.value = true;
      }}
    >
      {label || value}
    </span>
  );
});
