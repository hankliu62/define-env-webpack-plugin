const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'cheap-source-map',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `autobase.es${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
    library: {
      type: 'module', // 类库加载方式
    }
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            warnings: false
          },
        },
      })
    ]
  },

  // 将 externals 类型设置为 'module'，webpack 将会在 module 中为外部引用生成形如 import * as X from '...' 的代码。
  // 确保首先把 experiments.outputModule 设置为 true, 否则 webpack 将会报错。
  externalsType: 'module',
  experiments: {
    outputModule: true,
  },
  externals: {
    // webpack 不需要编译
    'webpack': 'webpack',
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
}

