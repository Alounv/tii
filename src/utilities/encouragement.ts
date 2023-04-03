import { Configuration, OpenAIApi } from "openai";
import type { Objective, Success } from "~/server/db/schema";

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

const getTextCompletion = async (prompt: string): Promise<string> => {
  try {
    const completion = await openai.createCompletion(
      { ...OPTIONS, prompt },
      { timeout: 60_000 },
    );
    return completion.data.choices[0].text || "";
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface IGetPrompt {
  objective: Pick<
    Objective,
    "coach" | "duration" | "description" | "motivation"
  > & { success: Success[] };
  name: string;
}

const getPrompt = ({ objective, name }: IGetPrompt): string => {
  const successCount = objective.success.length;

  return `
  Imagine ${objective.coach} is encouraging ${name} 
  to pursue his goal of ${objective.description} for ${objective.duration} days 
  in order to afford ${objective.motivation}.
  It has lasted ${successCount} days already.
  The style of ${objective.coach} must be recognizable and it must be funny.
  `;
};

export const getEncouragement = async ({ objective, name }: IGetPrompt) => {
  const prompt = getPrompt({ objective, name });
  const completion = await getTextCompletion(prompt);
  return completion;
};
