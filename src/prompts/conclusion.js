import fs from 'fs';
import path from 'path';

const conclusion = fs.readFileSync(
  path.resolve('@/../prompts/conclusion.md'),
  'utf8'
);

export default conclusion;
