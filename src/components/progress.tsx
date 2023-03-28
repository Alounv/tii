import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import type { Objective, Success } from "@prisma/client";
import { Section } from "./section";
import { SuccessCheckbox } from "./success";

interface IProgressSection {
  objective: Objective & { success: Success[] };
  successAction: ActionStore<
    unknown,
    { objectiveId: string; isDone: boolean },
    boolean
  >;
}

export const ProgressSection = component$(
  ({ objective, successAction }: IProgressSection) => {
    const { duration, success } = objective;

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
      <Section title="Progress">
        <div class="p-6 flex gap-4 flex-wrap">
          {checkboxes.map((s) => {
            const isToday = s.date.getDate() === today.getDate();
            return (
              <SuccessCheckbox
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
    );
  }
);
