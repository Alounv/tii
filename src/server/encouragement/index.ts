import { Objective, Success, User } from "@prisma/client";
import { getTextCompletion } from "../openai";


export const getEncouragement = async ({objective, user}:{objective: Objective & { success: Success[] }, user: User}): Promise<string> => {
  const successCount = objective.success.length;

  const prompt = `
  Imagine ${objective.coach} is encouraging ${user.name} 
  to pursue his goal of ${objective.description} for ${objective.duration} days 
  in order to afford ${objective.motivation}.
  It has lasted ${successCount} days already.
  The style of ${objective.coach} must be recognizable and it must be funny.
  `

  const { encouragement, error } = await getTextCompletion(prompt);
  if (error) {
    console.error(error);
    return 'Sorry, there was an error. Please try again later.';
  }


  return encouragement  || '';
};
