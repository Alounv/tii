import { Configuration, OpenAIApi } from 'openai'

const OPTIONS = {
  max_tokens: 2048,
  temperature: 0.6,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
  best_of: 1,
  model: 'text-davinci-003'
}

export const getTextCompletion = async (prompt: string): Promise<string> => {
    const configuration = new Configuration({ apiKey: import.meta.env.VITE_OPENAI_API_KEY })
    const openai = new OpenAIApi(configuration)
    const completion = await openai.createCompletion(
      { ...OPTIONS, prompt },
      { timeout: 60_000 }
    )
    return completion.data.choices[0].text || ''
}
