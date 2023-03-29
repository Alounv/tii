import { Objective, Success, User } from "@prisma/client";
import { getTextCompletion } from "../openai";
import { setCookie } from "~/utilities/cookie";


export const getEncouragement = async ({objective, user}:{objective: Objective & { success: Success[] }, user: User}): Promise<string> => {
  const successCount = objective.success.length;

  const prompt = `
  Wrote a unique phrase by ${objective.coach} to encourage ${user.name} 
  to pursue his goal of ${objective.description} for ${objective.duration} days 
  in order to afford ${objective.motivation}. It has lasted ${successCount} days already.
  `

  const { encouragement, error } = await getTextCompletion(prompt);
  if (error) {
    console.error(error);
    return 'Sorry, there was an error. Please try again later.';
  }


  return encouragement  || '';
};
