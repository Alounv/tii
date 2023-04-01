import { Objective } from "~/data/objective";
import { getTextCompletion } from "../openai";
import { Success } from "~/data/success";
import { User } from "~/data/user";

export const getEncouragement = async ({objective, user}:{
  objective: Pick<Objective, 'coach' | 'duration' | 'description' | 'motivation'> & { success: Success[] },
  user: Pick<User, 'name'>
}): Promise<string> => {
  const successCount = objective.success.length;

  const prompt = `
  Imagine ${objective.coach} is encouraging ${user.name} 
  to pursue his goal of ${objective.description} for ${objective.duration} days 
  in order to afford ${objective.motivation}.
  It has lasted ${successCount} days already.
  The style of ${objective.coach} must be recognizable and it must be funny.
  `

  return await getTextCompletion(prompt);
};
