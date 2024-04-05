/* eslint-disable @typescript-eslint/no-explicit-any */
import webpack, { DefinePlugin } from 'webpack';
import DefineEnvWebpackPlugin from '../src/index';

const Owner = 'hankliu62';
const Repo = 'define-env-webpack-plugin';
const Action = "build and publish";

// 在你的测试文件中
describe('create include option plugin', () => {
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

  test('string type include options should inject one correct env', () => {
    const compiler = webpack({
      entry: './entry.js',
      mode: 'production',
      plugins: [new DefineEnvWebpackPlugin({
        include: 'GITHUB_ACTIONS'
      })]
    });

    compiler.hooks.thisCompilation.tap("Test", (compilation) => {
      const definePlugin: DefinePlugin = compilation.options.plugins.find(
        (plugin) => plugin?.constructor && plugin?.constructor.name === 'DefinePlugin'
      ) as DefinePlugin;

      const expectDefine = {
        ["process.env"]: {
          GITHUB_ACTIONS: Action,
        }
      }

      expect(definePlugin).not.toBeNull();
      expect(definePlugin.definitions).not.toBeNull();
      expect(definePlugin.definitions).toMatchObject(expectDefine);
    });
  });

  test('array type include options should inject multi correct env', () => {
    const compiler = webpack({
      entry: './entry.js',
      mode: 'production',
      plugins: [new DefineEnvWebpackPlugin({
        include: ['GITHUB_ACTIONS', 'GITHUB_REPOSITORY']
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

  test('function type include options should inject multi correct env', () => {
    const compiler = webpack({
      entry: './entry.js',
      mode: 'production',
      plugins: [new DefineEnvWebpackPlugin({
        include: (key: string): boolean => ['GITHUB_ACTIONS', 'GITHUB_OWNER'].includes(key),
      })]
    });

    compiler.hooks.thisCompilation.tap("Test", (compilation) => {
      const definePlugin: DefinePlugin = compilation.options.plugins.find(
        (plugin) => plugin?.constructor && plugin?.constructor.name === 'DefinePlugin'
      ) as DefinePlugin;

      const expectDefine = {
        ["process.env"]: {
          GITHUB_ACTIONS: Action,
          GITHUB_OWNER: Owner,
        }
      }

      expect(definePlugin).not.toBeNull();
      expect(definePlugin.definitions).not.toBeNull();
      expect(definePlugin.definitions).toMatchObject(expectDefine);
    });
  });

  test('regexp type include options should inject multi correct env', () => {
    const compiler = webpack({
      entry: './entry.js',
      mode: 'production',
      plugins: [new DefineEnvWebpackPlugin({
        include: /OWNER$/,
      })]
    });

    compiler.hooks.thisCompilation.tap("Test", (compilation) => {
      const definePlugin: DefinePlugin = compilation.options.plugins.find(
        (plugin) => plugin?.constructor && plugin?.constructor.name === 'DefinePlugin'
      ) as DefinePlugin;

      const expectDefine = {
        ["process.env"]: {
          GITHUB_OWNER: Owner,
        }
      }

      expect(definePlugin).not.toBeNull();
      expect(definePlugin.definitions).not.toBeNull();
      expect(definePlugin.definitions).toMatchObject(expectDefine);
    });
  });
});

