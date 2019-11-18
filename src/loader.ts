import { getOptions, stringifyRequest } from 'loader-utils';
import validateOptions from 'schema-utils';
import { JSONSchema7 } from 'json-schema';
import { loader as WebpackLoader } from 'webpack';
import { transformAsync } from '@babel/core';
import dedent from 'dedent';
import path from 'path';

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
      [
        '@babel/plugin-transform-modules-commonjs',
        {
          strictMode: false, // don't worry, we'll insert this into the exported module later
        },
      ],
    ],
  });

  const doctype = options.doctype ? '<!DOCTYPE html>' : '';
  const vhtmlSrc = stringifyRequest(
    this,
    // see https://github.com/webpack/loader-utils/issues/115 for use of this._compiler here
    // html-webpack-plugin author says this can't happen in webpack 4 but it CAN
    path.relative(this._compiler.context, require.resolve('@bjacobel/vhtml')),
  );

  callback(
    null,
    dedent`
      "use strict";
      var h = __non_webpack_require__(${vhtmlSrc});
      module.exports = function(data) {
        var htmlWebpackPlugin = data.htmlWebpackPlugin;
        ${babelResult!.code!}
        return "${doctype}" + (exports.default || module.exports);
      }
    `,
  );
}
