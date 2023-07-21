import { program } from 'commander';
import assert from 'assert';

program
  .option('-t, --title <string>', 'Title of the article to generate')
  .parse();

const options = program.opts();

const config = () => {
  assert(process.env.OPENAI_KEY, 'OPENAI_KEY is required');
  assert(options.title, '--title is required');

  const result = {
    env: {
      OPENAI_KEY: process.env.OPENAI_KEY
    },
    title: options.title
  };

  return result;
};

export default config();
