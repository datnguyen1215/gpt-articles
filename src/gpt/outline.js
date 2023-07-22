import config from '@/config';
import prompts from '@/prompts';
import { Configuration, OpenAIApi } from 'openai';

const generate = async title => {
  const { outline, env } = config();

  const openai = new OpenAIApi(new Configuration({ apiKey: env.OPENAI_KEY }));

  const completion = await openai.createChatCompletion({
    model: outline.model,
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

  return JSON.parse(answer);
};

export default generate;
