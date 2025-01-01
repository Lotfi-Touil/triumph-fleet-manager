const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = function (options, webpack) {
  return {
    ...options,
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@application': path.resolve(__dirname, '../../../application'),
        '@infrastructure': path.resolve(__dirname, '../../../infrastructure'),
        '@domain': path.resolve(__dirname, '../../../domain'),
      },
    },
  };
};
