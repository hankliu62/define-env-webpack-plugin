## define-env-webpack-plugin

创建一个Webpack插件，自动设置将当前环境中的 `process.env` 的属性和值注入到 `webpack.DefinePlugin` 中。

### 开始

在开始之前，你需要安装 define-env-webpack-plugin:

```
npm install define-env-webpack-plugin --save-dev
```

或者

```
yarn add -D define-env-webpack-plugin
```

或者

```
pnpm add -D define-env-webpack-plugin
```

然后将插件添加到你的 `webpack config` 文件中。 例如:

### 案例

#### 所有 `process.env` 的属性和值都注入

``` js
import webpack from 'webpack';
import DefineEnvWebpackPlugin from 'define-env-webpack-plugin';

export default {
  plugins: [
    DefineEnvWebpackPlugin()
  ]
};
```

#### 指定 `process.env` 的属性和值进行注入

``` js
import webpack from 'webpack';
import DefineEnvWebpackPlugin from 'define-env-webpack-plugin';

export default {
  plugins: [
    DefineEnvWebpackPlugin({ includes: ["NPM_TOKEN", "GITHUB_TOKEN"] }),
  ]
};
```

### 参数

| name                          | type                  | default                                                        | description                                                                                                                                                                                                                     |
| ----------------------------- | --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| include                          | `String` / `Function` / `String[]` / `RegExp` | -                                                    | 需要注入到 `webpack.DefinePlugin` 中的`process.env` 的属性                                                                                                                                                                                                            |
| exclude                     | `String` / `Function` / `String[]` / `RegExp`              | -                                                              | 排除的不需要注入到 `webpack.DefinePlugin` 中的`process.env` 的属性                                                                                                                                                                                      |




