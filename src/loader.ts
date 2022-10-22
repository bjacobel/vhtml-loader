import { validate } from 'schema-utils';
import { JSONSchema7 } from 'json-schema';
import { LoaderContext } from 'webpack';
import { transformAsync } from '@babel/core';
import dedent from 'dedent';

interface Options {
  doctype?: boolean;
}

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

export default async function (this: LoaderContext<Options>, source: string) {
  const callback = this.async()!;
  const options = Object.assign({}, defaultOptions, this.getOptions(schema));

  this.cacheable && this.cacheable();

  validate(schema, options, {
    name: '@bjacobel/vhtml-loader',
  });

  const babelResult = await transformAsync(source, {
    filename: 'template',
    plugins: [
      require.resolve('./discardImports'),
      require.resolve('./fixNewlines'),
      '@babel/plugin-transform-typescript',
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
  const vhtmlSrc = JSON.stringify(
    this.utils.contextify(
      this.context || this.rootContext,
      require.resolve('@bjacobel/vhtml'),
    ),
  );

  callback(
    null,
    dedent`
      "use strict";
      var h = require(${vhtmlSrc});
      module.exports = function(data) {
        var htmlWebpackPlugin = data.htmlWebpackPlugin;
        ${babelResult!.code!}
        return "${doctype}" + (exports.default || module.exports);
      }
    `,
  );
}
