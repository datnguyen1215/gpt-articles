import './alias';
import 'dotenv/config';
import config from './config';
import { createLogger } from '@/logger';
import gpt from '@/gpt';

const logger = createLogger('index');

logger.info(`config: ${JSON.stringify(config())}`);

(async () => {
  logger.info(`Generating outline for ${config().TITLE}`);

  const outline = await gpt.outline(config().TITLE);
  logger.info(`Outline: ${JSON.stringify(outline, null, 2)}`);
})();
