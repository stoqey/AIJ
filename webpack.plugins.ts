import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

export const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
];


const uglifyJsPlugin = new UglifyJSPlugin({
  uglifyOptions: {
    compress: {
      drop_console: true,
    }
  }

});

// if (!isDev) {
//   plugins.push(uglifyJsPlugin as any)
// }
