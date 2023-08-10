import './alias';
import 'dotenv/config';
import config from './config';
import { createLogger } from '@/logger';
import gpt from '@/gpt';
import fs from 'fs';
import path from 'path';

const logger = createLogger('index');

const badTitles = [];

/**
 * Split an array into chunks of a given size.
 * @param {any[]} arr
 * @param {number} size
 * @returns
 */
const toChunk = (arr, size) => {
  const result = [];

  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size));

  return result;
};

/**
 * Remove numbers from headings.
 *  Example:
 *    ## 9. Heading
 *    #### 9.1 Heading
 * @param {string} text
 * @returns {string}
 */
const removeHeadingNumber = text => {
  const regex = /(#.+?\s)\d+\.(\d+\.?)?\s/gi;
  return text.replace(regex, '$1');
};

/**
 * Remove special characters from a string.
 * @param {string} inputString
 * @returns {string}
 */
function removeSpecialCharacters(inputString) {
  // Use a regular expression to match any character that is not a letter or a number
  const cleanedString = inputString.replace(/[^a-zA-Z0-9\s]/g, '');
  return cleanedString;
}

/**
 * Generate and write an article to a file.
 * @param {string} title
 */
const generate = async title => {
  const article = await gpt.article(title);

  if (!article) return badTitles.push(title);

  const filePath = path.resolve(
    '@/../articles/',
    `${removeSpecialCharacters(article.title)}.md`
  );

  // create folder if not exist
  const articleDirectory = path.dirname(filePath);

  if (!fs.existsSync(articleDirectory)) fs.mkdirSync(articleDirectory);

  logger.info(`Writing "${article.title}" to ${filePath}...`);

  const text =
    `Title: ${article.title}\n\n` +
    `Description: ${article.description}\n\n` +
    `Outline:\n${article.outline}\n\n` +
    `Content:\n${removeHeadingNumber(article.content)}\n`;

  const removeMarkdownRegex = /\*\*(.*)\*\*/gi;

  fs.writeFileSync(filePath, text.replace(removeMarkdownRegex, '$1'));
};

(async () => {
  logger.info(`Configuration: ${JSON.stringify(config())}`);

  // only generate 10 articles at a time. OpenAI limits the GPT 4 API to only
  // 200 requests per minute.
  const { titles } = config();
  const titleChunks = toChunk(titles, 2);

  // Run each chunk.
  for (var chunk of titleChunks) {
    const promises = chunk.map(async title => await generate(title));
    await Promise.all(promises);
  }

  logger.info('Done!');

  if (badTitles.length === 0) return;
  logger.error(`Titles that cannot be generated:\n${badTitles.join('\n')}`);
})();

process.on('uncaughtException', err => {
  logger.error(`Uncaught exception: ${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  logger.error(`Unhandled rejection: ${err.stack}`);
  process.exit(1);
});
