import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import HTMLWebpackPlugin, { Options } from 'html-webpack-plugin';
import { LoaderOptions } from '../loader';

// Borrowed and modified from https://webpack.js.org/contribute/writing-a-loader/#testing

export default async (
  template: string,
  htmlWebpackPluginOpts?: Options,
  loaderOptions?: LoaderOptions,
): Promise<{ html?: string; source: string | undefined }> => {
  const fs = new MemoryFS();
  const compiler = webpack({
    context: __dirname,
    entry: '../../fixtures/entry.js',
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.html\.[jt]sx$/,
          use: {
            loader: require.resolve('../loader.ts'),
            options: loaderOptions,
          },
        },
      ],
    },
    plugins: [
      new HTMLWebpackPlugin({
        template,
        inject: false,
        ...htmlWebpackPluginOpts,
      }),
    ],
  });

  compiler.outputFileSystem = fs;

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats) {
        if (stats.hasErrors()) {
          reject(new Error(stats.toJson().errors![0]!.message));
        }
        let html = 'not emitted';
        try {
          html = fs.readFileSync(
            path.resolve(__dirname, 'index.html'),
            'utf-8',
          );
        } catch (e) {}

        const childCompilation = stats
          .toJson({
            source: true,
          })
          .children?.find((c) => c.name?.startsWith('HtmlWebpackCompiler'));

        resolve({
          html,
          source: String(
            childCompilation!.modules!.find((m) => m.name?.endsWith(template))!
              .source,
          ),
        });
      }
    });
  });
};

export const parseOutput = (output: string): string =>
  (output.match(/module\.exports = '(.*)';/) ?? ['no module.export found'])[1];
