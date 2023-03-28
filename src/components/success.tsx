import { component$ } from "@builder.io/qwik";
import type { ActionStore } from "@builder.io/qwik-city";

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

export const SuccessCheckbox = component$(
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
