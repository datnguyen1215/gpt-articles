import fs from 'fs';
import path from 'path';

const faq = fs.readFileSync(path.resolve('@/../prompts/faq.md'), 'utf8');

export default faq;
