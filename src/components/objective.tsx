import { Slot, component$ } from "@builder.io/qwik";
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
    successPassed.pop();

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

    const checkboxes: Pick<Success, "date" | "id">[] = [
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
          <h1 class="text-4xl font-bold text-gray-800">{description}</h1>
          <div class="mt-6">
            <span class="text-lg">
              For <span class="font-medium text-gray-800">{duration}</span>{" "}
              days, save{" "}
              <span class="font-medium text-gray-800">{`${dailySaving} €`}</span>{" "}
              on each success.
            </span>
          </div>

          <div class="mt-12">
            <div>
              Coached by: <span class="font-medium text-gray-800">{coach}</span>
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

            <div class="flex-1 p-2">
              <div class="text-lg font-medium mb-4 text-gray-800">
                {motivation}
                <span class="text-gray-400 text-sm">{` (${cost} €)`}</span>
              </div>
              <div class="rounded-xl shadow drop-shadow-lg p-4 bg-gray-50 overflow-hidden">
                <img class="rounded-md" src={motivation_url} alt={motivation} />
                <div class="absolute top-0 bottom-0 left-0 right-0 opacity-25 bg-white" />
              </div>
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
          name="isDone"
          type="checkbox"
          disabled={!successAction}
          checked={isPassed}
          class="h-8 w-8 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
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
