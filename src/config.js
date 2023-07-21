import assert from 'assert';

const config = () => {
  assert(process.env.OPENAI_KEY, 'OPENAI_KEY is required');

  const result = {
    OPENAI_KEY: process.env.OPENAI_KEY,
    TITLE: process.env.TITLE
  };

  return result;
};

export default config;
