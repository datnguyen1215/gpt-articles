import './alias';
import 'dotenv/config';
import config from './config';
import { createLogger } from '@/logger';
import gpt from '@/gpt';
import fs from 'fs';
import path from 'path';

const logger = createLogger('index');

logger.info(`config: ${JSON.stringify(config())}`);

(async () => {
  const configuration = config();
  const article = await gpt.article(configuration.TITLE);

  const filePath = path.resolve('@/../articles/', `${configuration.TITLE}.txt`);

  logger.info(`Writing article to ${filePath}...`);
  const text =
    `Title: ${article.title}\n\n` +
    `Outline:\n${article.outline}\n\n` +
    `Content:\n${article.content}\n`;

  fs.writeFileSync(filePath, text);
})();
