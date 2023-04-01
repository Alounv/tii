import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";
import type { SetSuccessSchema } from "~/routes";
import { eraseCookie } from "~/utilities/cookie";

interface ISuccess {
  isPassed: boolean;
  isFailed: boolean;
  date: Date;
  objectiveId: string;
  successAction?: ActionStore<unknown, SetSuccessSchema, boolean>;
}

export const SuccessCheckbox = component$(
  ({ isPassed, isFailed, date, successAction, objectiveId }: ISuccess) => {
    const day = date.getDate();
    const month = date.getMonth();
    const isDisabled = !successAction;

    return (
      <div class="flex-shrink-0 flex flex-col items-center gap-2">
        <label class="text-sm text-gray-400 cursor-pointer" for="today">
          <strong class="text-gray-600">{day}</strong> / <span>{month}</span>
        </label>
        <input
          id="today"
          type="checkbox"
          disabled={isDisabled}
          checked={isPassed}
          class={`h-8 w-8 rounded disabled:border-gray-300 border-gray-500 text-sky-600 disabled:text-sky-500 focus:ring-sky-600 ${
            isFailed ? " bg-gray-300" : ""
          } ${isDisabled ? "" : " shadow-lg drop-shadow-lg"}}`}
          onChange$={async (event) => {
            // eslint-disable-next-line qwik/valid-lexical-scope
            await successAction?.submit({
              objectiveId,
              date: date.toString(),
              isDone: event.target.checked,
            });
            eraseCookie("encouragement");
          }}
        />
      </div>
    );
  },
);
