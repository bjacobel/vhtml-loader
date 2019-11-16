import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';

// Borrowed right from https://webpack.js.org/contribute/writing-a-loader/#testing

export default async (fixture: string, options = {}): Promise<string> => {
  const compiler = webpack({
    context: __dirname,
    entry: `../../fixtures/${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.html\.jsx$/,
          use: {
            loader: path.resolve(__dirname, '../loader.ts'),
            options,
          },
        },
      ],
    },
  });

  compiler.outputFileSystem = new MemoryFS();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors[0]));
      resolve(stats.toJson().modules![0].source);
    });
  });
};
