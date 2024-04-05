import { Compiler, Compilation, DefinePlugin } from 'webpack';

type TInclude = string|(string[])|((key: string) => boolean)|RegExp;

export interface Options {
  include?: TInclude
  exclude?: TInclude
}

/**
 * 创建一个Webpack插件，自动设置将当前环境中的 `process.env` 的属性和值注入到 `webpack.DefinePlugin` 中。
 *
 * DefineEnvWebpackPlugin 类，用于将环境变量注入到Webpack的DefinePlugin中。
 *
 * @example
 * ```js
 * import DefineEnvWebpackPlugin from 'define-env-webpack-plugin';
 *
 * export default {
 *   plugins: [
 *     DefineEnvWebpackPlugin()
 *   ]
 * };
 * ```
 *
 * @constructor
 * @param opts 可选参数，用于控制哪些环境变量被注入。
 *             包括 `include` 和 `exclude` 两个属性，用于指定需要或不需要注入的环境变量。
 */
export class DefineEnvWebpackPlugin {
  // 需要注入的环境变量Map
  injectMap: Map<string, string|undefined>;
  constructor(opts?: Options) {
    // 需要注入的条件
    const include = opts?.include;
    // 需要排除的条件
    const exclude = opts?.exclude;

    // 初始化
    this.injectMap = new Map()

    const env = process.env || {};

    // 遍历环境变量，决定哪些应该被注入
    for (const [key, value] of Object.entries(env)) {
      let shouldInjected: boolean = false;

      // 判断是否应该注入环境变量的逻辑
      if (!opts) {
        shouldInjected = true;
      } else {
        // include 条件判断
        if (include !== undefined && include !== null) {
          // 获得类型
          const includeType = Object.prototype.toString.call(include).slice(8, -1);
          switch (includeType) {
            case 'String': {
              (include === key) && (shouldInjected = true);
              break;
            }
            case 'Array': {
              ((include as string[]).includes(key)) && (shouldInjected = true);
              break;
            }
            case 'Function': {
              ((include as (key: string) => boolean)(key)) && (shouldInjected = true);
              break;
            }
            case 'RegExp': {
              ((include as RegExp).test(key)) && (shouldInjected = true);
              break;
            }
            default: {
              shouldInjected = false
            }
          }
        }

        // exclude 条件判断
        if (exclude !== undefined && exclude !== null) {
          // 获得类型
          const excludeType = Object.prototype.toString.call(exclude).slice(8, -1);
          switch (excludeType) {
            case 'String': {
              (exclude === key) && (shouldInjected = false);
              break;
            }
            case 'Array': {
              ((exclude as string[]).includes(key)) && (shouldInjected = false);
              break;
            }
            case 'Function': {
              ((exclude as (key: string) => boolean)(key)) && (shouldInjected = false);
              break;
            }
            case 'RegExp': {
              ((exclude as RegExp).test(key)) && (shouldInjected = false);
              break;
            }
            default: {
              break;
            }
          }
        }
      }

      // 符合条件的环境变量被注入到injectMap中
      shouldInjected && this.injectMap.set(`process.env.${key}`, value);
    }
  }

  /**
   * 将环境变量注入到Webpack编译过程中。
   * @param compiler Webpack编译器实例。
   */
  apply(compiler: Compiler): void {
    // 在当前编译器创建完成之后，修改 DefinePlugin 插件中的 definitions 属性
    compiler.hooks.thisCompilation.tap('DefineEnvWebpackPlugin', (compilation: Compilation) => {

      // 查找已有的DefinePlugin插件实例，如果存在则修改其definitions，不存在则创建新的DefinePlugin实例
        // 获取DefinePlugin的定义
        const definePlugin = compilation.options.plugins.find(
          (plugin) => plugin?.constructor && plugin?.constructor.name === 'DefinePlugin'
        );

        if (definePlugin) {
          // 修改已有的DefinePlugin实例的definitions
          for (const [key, value] of this.injectMap) {
            (definePlugin as DefinePlugin).definitions[key] = JSON.stringify(value);
          }
        } else {
          // 创建新的DefinePlugin实例并注入到编译器中
          const definitions: Record<string, string|undefined> = {}
          for (const [key, value] of this.injectMap) {
            definitions[key] = JSON.stringify(value);
          }
          const definePlugin = new DefinePlugin(definitions);

          definePlugin.apply(compiler);
        }
    });
  }
}

export default DefineEnvWebpackPlugin;
