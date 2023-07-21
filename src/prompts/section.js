import fs from 'fs';
import path from 'path';

const section = fs.readFileSync(
  path.resolve('@/../prompts/section.md'),
  'utf8'
);

export default section;
