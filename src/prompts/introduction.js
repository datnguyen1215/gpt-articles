import fs from 'fs';
import path from 'path';

const introduction = fs.readFileSync(
  path.resolve('@/../prompts/introduction.md'),
  'utf8'
);

export default introduction;
