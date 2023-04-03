import { Configuration, OpenAIApi } from "openai";
import type { Objective } from "~/server/db/schema";

const OPTIONS = {
  max_tokens: 2048,
  temperature: 0.6,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
  best_of: 1,
  model: "text-davinci-003",
};

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getTextCompletion = async (
  prompt: string,
  onData: (data: string) => void,
): Promise<void> => {
  const response = await openai.createCompletion(
    { ...OPTIONS, prompt, stream: true },
    { timeout: 60_000, responseType: "stream" },
  );

  // @ts-ignore
  response.data.on("data", (data) => {
    const lines = data
      .toString()
      .split("\n")
      .filter((line: string) => line.trim() !== "");

    for (const l of lines) {
      const message = l.replace(/^data: /, "");
      if (message === "[DONE]") {
        onData("[DONE]");
        return;
      }

      try {
        const parsedData = JSON.parse(message);
        const content = parsedData?.choices?.[0]?.text;
        if (content) onData(content);
      } catch (e: any) {
        console.error(`Could not parse data string |${message}|`, e.message);
      }
    }
  });
};

interface IGetPrompt {
  objective: Pick<
    Objective,
    "coach" | "duration" | "description" | "motivation"
  >;
  successCount: number;
  name: string;
}

const getPrompt = ({ objective, successCount, name }: IGetPrompt): string => {
  return `
  Imagine ${objective.coach} is encouraging ${name} 
  to pursue his goal of ${objective.description} for ${objective.duration} days 
  in order to afford ${objective.motivation}.
  It has lasted ${successCount} days already.
  The style of ${objective.coach} must be recognizable and it must be funny.
  `;
};

export const getEncouragement = async ({
  objective,
  successCount,
  name,
  onData,
}: IGetPrompt & { onData: (data: string) => void }) => {
  const prompt = getPrompt({ objective, name, successCount });
  getTextCompletion(prompt, onData);
};
