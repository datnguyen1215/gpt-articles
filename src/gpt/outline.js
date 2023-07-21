import config from '@/config';
import prompts from '@/prompts';
import { Configuration, OpenAIApi } from 'openai';

const generate = async title => {
  const openai = new OpenAIApi(
    new Configuration({ apiKey: config.env.OPENAI_KEY })
  );

  const completion = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: prompts.personality
      },
      {
        role: 'user',
        content: prompts.outline.replaceAll('{title}', title)
      }
    ]
  });

  let answer = completion.data.choices[0].message.content;

  const regex = /```json\s*(.*?)\s*```/s;
  const match = regex.exec(answer);

  if (!match) return null;

  return JSON.parse(match[1]);
};

export default generate;
