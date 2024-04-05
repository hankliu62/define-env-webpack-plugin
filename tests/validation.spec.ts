import DefineEnvWebpackPlugin from '../src/index';

describe('validation', () => {
  test('validation create plugin', () => {
    expect(() => {
      new DefineEnvWebpackPlugin();
    }).not.toThrow();

    expect(() => {
      new DefineEnvWebpackPlugin({
        include: 'GITHUB_ACTIONS'
      });
    }).not.toThrow();

    expect(() => {
      new DefineEnvWebpackPlugin({
        include: ['GITHUB_ACTIONS', 'GITHUB_REPOSITORY']
      });
    }).not.toThrow();

    expect(() => {
      new DefineEnvWebpackPlugin({
        exclude: (key: string): boolean => ['GITHUB_ACTIONS', 'GITHUB_OWNER'].includes(key),
      })
    }).not.toThrow();

    expect(() => {
      new DefineEnvWebpackPlugin({
        exclude: /OWNER$/,
      })
    }).not.toThrow();

    expect(() => {
      new DefineEnvWebpackPlugin({
        include: ['GITHUB_ACTIONS', 'GITHUB_REPOSITORY', "GITHUB_OWNER"],
        exclude: /owner$/i,
      })
    }).not.toThrow();
  })
})
