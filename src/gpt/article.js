import { createLogger } from '@/logger';
import outline from './outline';
import prompts from '@/prompts';
import { Configuration, OpenAIApi } from 'openai';
import config from '@/config';

const logger = createLogger('gpt.article');

const generate = async title => {
  const { article, env } = config();

  const openai = new OpenAIApi(new Configuration({ apiKey: env.OPENAI_KEY }));

  logger.info(`Generating outline for "${title}"...`);
  const generatedOutline = await outline(title);

  const sections = generatedOutline.outline.map(
    (section, index) =>
      `${index + 1}. ${section.text}\n` +
      `${section.points
        .map((x, i) => `${index + 1}.${i + 1}. ${x}`)
        .join('\n')}`
  );

  logger.info(`Generating article for "${title}"...`);
  const promises = sections.map(
    async section =>
      await openai.createChatCompletion({
        model: article.model,
        messages: [
          {
            role: 'system',
            content: prompts.personality
          },
          {
            role: 'user',
            content: prompts.section
              .replaceAll('{title}', title)
              .replaceAll('{outline}', sections.join('\n'))
              .replaceAll('{section}', section)
          }
        ]
      })
  );

  promises.push(
    openai.createChatCompletion({
      model: article.model,
      messages: [
        {
          role: 'system',
          content: prompts.personality
        },
        {
          role: 'user',
          content: prompts.faq
            .replaceAll('{title}', title)
            .replaceAll('{outline}', sections.join('\n'))
        }
      ]
    })
  );

  const results = await Promise.all(promises);
  return {
    title,
    outline: sections.join('\n'),
    content: results.map(x => x.data.choices[0].message.content).join('\n')
  };
};

export default generate;
