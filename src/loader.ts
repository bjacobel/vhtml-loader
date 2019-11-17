import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import { JSONSchema7 } from 'json-schema';
import { loader as WebpackLoader } from 'webpack';
import { transformAsync } from '@babel/core';
import dedent from 'dedent';

const schema: JSONSchema7 = {
  type: 'object',
  properties: {
    doctype: {
      type: 'boolean',
      default: true,
    },
  },
};

const defaultOptions = {
  doctype: true,
};

export default async function(
  this: WebpackLoader.LoaderContext,
  source: string,
) {
  const callback = this.async()!;
  const options = Object.assign({}, defaultOptions, getOptions(this));

  this.cacheable && this.cacheable();

  validateOptions(schema, options, {
    name: '@bjacobel/vhtml-loader',
  });

  const babelResult = await transformAsync(source, {
    plugins: [
      require.resolve('./discardImports'),
      ['@babel/plugin-transform-react-jsx', { pragma: 'h', useBuiltIns: true }],
      ['@babel/plugin-transform-modules-commonjs', { strictMode: false }],
    ],
  });

  // const doctype = options.doctype ? '<!DOCTYPE html>' : '';

  callback(
    null,
    dedent`
      var h = __non_webpack_require__(${JSON.stringify(
        require.resolve('vhtml'),
      )});
      module.exports = function(data) {
        with(data) {
          ${babelResult!.code!}
          return exports.default || module.exports;
        }
      }
    `,
  );
}
