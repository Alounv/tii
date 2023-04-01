import { component$ } from "@builder.io/qwik";
import { Section } from "./section";
import { SuccessCheckbox } from "./success";
import { getIsTheSameDay, getIsToday, getIsYesterday } from "~/utilities/date";
import { useToggleTodaySuccess } from "~/routes";
import type { Success } from "~/data/success";
import type { Objective } from "~/data/objective";

const getNumberOfBoxes = (duration: number, success: Success[]) => {
  const now = new Date();
  const dates = success.map((s) => s.date);
  dates.sort((a, b) => a.getTime() - b.getTime());

  const lastDate = dates[dates.length - 1];
  const firstDate = dates[0] || now;
  const isTodayPassed = getIsToday(lastDate);

  const pastDays = Math.ceil((now.getTime() - firstDate.getTime()) / 86400000);
  const remainingDays = duration - success.length;
  const count = pastDays + remainingDays + (isTodayPassed ? 1 : 0);
  return { pastDaysCount: pastDays, boxesCount: count };
};

const getCheckboxes = ({
  success,
  boxesCount,
  pastDaysCount,
}: {
  success: Success[];
  boxesCount: number;
  pastDaysCount: number;
}) => {
  const now = new Date();
  return new Array(boxesCount).fill(0).map((_, i) => {
    const boxDate = new Date(now);
    boxDate.setDate(boxDate.getDate() - pastDaysCount + i);

    const daySuccess = success.find((s) => {
      return getIsTheSameDay(s.date, boxDate);
    });

    if (daySuccess) {
      return { date: boxDate, id: daySuccess.id, isPassed: true };
    }

    return { date: boxDate, id: i, isPassed: false };
  });
};

interface IProgressSection {
  objective: Objective & { success: Success[] };
}

export const ProgressSection = component$(({ objective }: IProgressSection) => {
  const successAction = useToggleTodaySuccess();
  const { duration, success } = objective;
  const { pastDaysCount, boxesCount } = getNumberOfBoxes(duration, success);
  const checkboxes = getCheckboxes({ success, boxesCount, pastDaysCount });

  return (
    <Section title="Progress">
      <div class="p-6 flex gap-4 flex-wrap">
        {checkboxes.map((s) => {
          const isToday = getIsToday(s.date);
          const isYesterday = getIsYesterday(s.date);
          const isInThePast =
            !isToday && s.date.getTime() < new Date().getTime();
          return (
            <SuccessCheckbox
              key={s.id}
              isPassed={s.isPassed}
              isFailed={isInThePast && !s.isPassed}
              date={s.date}
              objectiveId={objective.id}
              successAction={isToday || isYesterday ? successAction : undefined}
            />
          );
        })}
      </div>
    </Section>
  );
});
