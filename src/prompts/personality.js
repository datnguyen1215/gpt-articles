import fs from 'fs';
import path from 'path';

const outline = fs.readFileSync(
  path.resolve('@/../prompts/personality.md'),
  'utf8'
);

export default outline;
