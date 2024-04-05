import { Compiler } from 'webpack';
type TInclude = string | (string[]) | ((key: string) => boolean) | RegExp;
export interface Options {
    include?: TInclude;
    exclude?: TInclude;
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
export declare class DefineEnvWebpackPlugin {
    injectMap: Map<string, string | undefined>;
    constructor(opts?: Options);
    /**
     * 将环境变量注入到Webpack编译过程中。
     * @param compiler Webpack编译器实例。
     */
    apply(compiler: Compiler): void;
}
export default DefineEnvWebpackPlugin;
