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
    filename: `autobase.umd${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
    library: {
      type: 'umd', // 类库加载方式
      // const AutoBaseWebpackPlugin = require("autobase-webpack-plugin").default;
      // webpack用umd方式打包出来全局用要加个default，使用这个就不需要后面的default
      export: 'default',
    },
    globalObject: 'this'
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
  externals: {
    // webpack 不需要编译
    'webpack': 'webpack',
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
}

