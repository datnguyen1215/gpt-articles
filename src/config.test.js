import config from './config';
import assert from 'assert';

describe('config.js', () => {
  beforeEach(() => {
    process.env.OPENAI_KEY = '123';
  });

  it('should throw if OPENAI_KEY is not set', () => {
    process.env.OPENAI_KEY = null;
    assert.throws(() => config(), 'OPENAI_KEY is required');
  });

  it('should throw if both title and titleFile are not set', () => {
    process.argv = [];
    assert.throws(() => config(), {
      message: '--title or --titleFile is required'
    });
  });

  it('should throw if tileFile does not exist', () => {
    process.argv = [
      'node',
      'src/index.js',
      '--titleFile',
      'does-not-exist.txt'
    ];
    assert.throws(() => config(), { message: 'titleFile does not exist' });
  });

  it('should return env and titles if --titleFile is set', () => {
    process.argv = ['node', 'src/index.js', '--titleFile', 'prompts/titles.md'];

    const settings = config();
    assert(settings.titles.length > 0, 'should have titles');
    assert(settings.env.OPENAI_KEY, 'should have OPENAI_KEY');
  });

  it('should return env and titles if --title is set', () => {
    process.argv = ['node', 'src/index.js', '--title', 'test'];

    const settings = config();
    assert(settings.titles.length === 1, 'should have one title');
    assert(settings.env.OPENAI_KEY, 'should have OPENAI_KEY');
  });
});
