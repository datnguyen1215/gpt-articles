import { Command } from 'commander';
import assert from 'assert';
import fs from 'fs';

const config = () => {
  const program = new Command();
  program
    .option('-t, --title <string>', 'Title of the article to generate')
    .option('-t, --titleFile <string>', 'File containing titles to generate')
    .option('-r, --require <string>', 'ignored')
    .option('-e, --exit <string>', 'ignored')
    .parse();

  const options = program.opts();

  assert(process.env.OPENAI_KEY, 'OPENAI_KEY is required');
  assert(
    options.title || options.titleFile,
    '--title or --titleFile is required'
  );

  assert(
    !(options.title && options.titleFile),
    'Cannot use both --title and --titleFile'
  );

  if (options.titleFile)
    assert(fs.existsSync(options.titleFile), 'titleFile does not exist');

  // either load a single title or load a file containing titles.
  const titles = options.title
    ? [options.title]
    : fs.readFileSync(options.titleFile, 'utf8').split('\n').filter(x => x);

  const result = {
    titles,
    env: {
      OPENAI_KEY: process.env.OPENAI_KEY
    }
  };

  return result;
};

export default config;
