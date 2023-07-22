import './alias';
import 'dotenv/config';
import config from './config';
import { createLogger } from '@/logger';
import gpt from '@/gpt';
import fs from 'fs';
import path from 'path';

const logger = createLogger('index');

const generate = async title => {
  const article = await gpt.article(title);

  const filePath = path.resolve('@/../articles/', `${title}.txt`);

  // create folder if not exist
  const articleDirectory = path.dirname(filePath);

  if (!fs.existsSync(articleDirectory)) fs.mkdirSync(articleDirectory);

  logger.info(`Writing "${title} to ${filePath}...`);

  const text =
    `Title: ${article.title}\n\n` +
    `Outline:\n${article.outline}\n\n` +
    `Content:\n${article.content}\n`;

  const removeMarkdownRegex = /\*\*(.*)\*\*/gi;

  fs.writeFileSync(filePath, text.replace(removeMarkdownRegex, '$1'));
};

(async () => {
  logger.info(`Configuration: ${JSON.stringify(config())}`);

  const promises = config().titles.map(async title => await generate(title));
  await Promise.all(promises);

  logger.info('Done!');
})();

process.on('uncaughtException', err => {
  logger.error(`Uncaught exception: ${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  logger.error(`Unhandled rejection: ${err.stack}`);
  process.exit(1);
});
