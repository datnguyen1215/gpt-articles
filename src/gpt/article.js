import { createLogger } from '@/logger';
import outline from './outline';
import prompts from '@/prompts';
import { Configuration, OpenAIApi } from 'openai';
import config from '@/config';

const logger = createLogger('gpt.article');

/**
 * Generate an article.
 * @param {string} details - title and description separated by ||
 * @param {number} [retry]  - number of retries
 * @returns {Promise<{title: string, description: string, outline: string, content: string}>}
 */
const generate = async (details, retry = 3) => {
  try {
    if (retry === 0) return null;

    const { article, env } = config();

    const openai = new OpenAIApi(new Configuration({ apiKey: env.OPENAI_KEY }));

    // separate title and description
    const [title, description] = details.split('||');

    // generate outline
    logger.info(`Generating outline for "${title}"...`);
    const generatedOutline = await outline(title);

    // combining the sections into meaningful table of contents.
    const sections = generatedOutline.outline.map(
      (section, index) =>
        `${index + 1}. ${section.text}\n` +
        `${section.points
          .map((x, i) => `${index + 1}.${i + 1}. ${x}`)
          .join('\n')}`
    );

    logger.info(`Generating article for "${title}"...`);
    const promises = [];

    // generate introduction
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
            content: prompts.introduction
              .replaceAll('{outline}', sections.join('\n'))
              .replaceAll('{title}', title)
              .replaceAll('{description}', description)
          }
        ]
      })
    );

    // generate sections
    promises.push(
      ...sections.map(
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
                  .replaceAll('{description}', description)
              }
            ]
          })
      )
    );

    // generate conclusion
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
            content: prompts.conclusion
              .replaceAll('{outline}', sections.join('\n'))
              .replaceAll('{title}', title)
              .replaceAll('{description}', description)
          }
        ]
      })
    );

    // generate FAQs
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
              .replaceAll('{description}', description)
          }
        ]
      })
    );

    const results = await Promise.all(promises);
    return {
      title,
      description,
      outline: sections.join('\n'),
      content: results.map(x => x.data.choices[0].message.content).join('\n')
    };
  } catch (error) {
    logger.error(`Error generating "${title}": ${error.stack}`);
    return generate(title, retry - 1);
  }
};

export default generate;
