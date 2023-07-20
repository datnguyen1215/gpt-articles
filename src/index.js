import './alias';
import 'dotenv/config';
import config from './config';
import { createLogger } from '@/logger';

const logger = createLogger('index');

logger.info(`config: ${JSON.stringify(config())}`);
