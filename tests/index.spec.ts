/* eslint-disable @typescript-eslint/no-explicit-any */
import webpack, { DefinePlugin } from 'webpack';
import DefineEnvWebpackPlugin from '../src/index';

const Owner = 'hankliu62';
const Repo = 'define-env-webpack-plugin';
const Action = "build and publish";

// 在你的测试文件中
describe('create plugin with empty option or both options', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.GITHUB_ACTIONS = Action;
    process.env.GITHUB_REPOSITORY = Repo;
    process.env.GITHUB_OWNER = Owner;
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
    jest.restoreAllMocks(); // 确保在每个测试后恢复所有mock
  });

  test('empty options should inject all env', () => {
    const compiler = webpack({
      entry: './entry.js',
      mode: 'production',
      plugins: [new DefineEnvWebpackPlugin()]
    });

    compiler.hooks.thisCompilation.tap("Test", (compilation) => {
      const definePlugin: DefinePlugin = compilation.options.plugins.find(
        (plugin) => plugin?.constructor && plugin?.constructor.name === 'DefinePlugin'
      ) as DefinePlugin;

      const expectDefine = {
        ["process.env"]: {
          GITHUB_ACTIONS: Action,
          GITHUB_REPOSITORY: Repo,
          GITHUB_OWNER: Owner,
        }
      }

      expect(definePlugin).not.toBeNull();
      expect(definePlugin.definitions).not.toBeNull();
      expect(definePlugin.definitions).toMatchObject(expectDefine);
    });
  });

  test('both include and exclude options should inject multi correct env', () => {
    const compiler = webpack({
      entry: './entry.js',
      mode: 'production',
      plugins: [new DefineEnvWebpackPlugin({
        include: ['GITHUB_ACTIONS', 'GITHUB_REPOSITORY', "GITHUB_OWNER"],
        exclude: /owner$/i,
      })]
    });

    compiler.hooks.thisCompilation.tap("Test", (compilation) => {
      const definePlugin: DefinePlugin = compilation.options.plugins.find(
        (plugin) => plugin?.constructor && plugin?.constructor.name === 'DefinePlugin'
      ) as DefinePlugin;

      const expectDefine = {
        ["process.env"]: {
          GITHUB_ACTIONS: Action,
          GITHUB_REPOSITORY: Repo,
        }
      }

      expect(definePlugin).not.toBeNull();
      expect(definePlugin.definitions).not.toBeNull();
      expect(definePlugin.definitions).toMatchObject(expectDefine);
    });
  });
});

