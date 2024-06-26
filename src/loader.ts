import { validate } from 'schema-utils';
import { JSONSchema7 } from 'json-schema';
import { LoaderContext } from 'webpack';
import { BabelFileResult, transformAsync } from '@babel/core';
import dedent from 'dedent';

export interface LoaderOptions {
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

export default async function (
  this: LoaderContext<LoaderOptions>,
  source: string,
) {
  const callback = this.async()!;
  const options = Object.assign({}, defaultOptions, this.getOptions(schema));

  this.cacheable && this.cacheable();

  validate(schema, options, {
    name: '@bjacobel/vhtml-loader',
  });

  let babelResult: BabelFileResult | null;

  try {
    babelResult = await transformAsync(source, {
      filename: 'template',
      plugins: [
        require.resolve('./discardImports'),
        require.resolve('./fixNewlines'),
        ['@babel/plugin-transform-typescript', { isTSX: true }],
        [
          '@babel/plugin-transform-react-jsx',
          { pragma: 'h', useBuiltIns: true },
        ],
        [
          '@babel/plugin-transform-modules-commonjs',
          {
            strictMode: false, // don't worry, we'll insert this into the exported module later
          },
        ],
      ],
    });
  } catch (e) {
    callback(e as Error);
    return;
  }

  const doctype = options.doctype ? '<!DOCTYPE html>' : '';
  const vhtmlSrc = JSON.stringify(
    this.utils.contextify(
      this.context || this.rootContext,
      require.resolve('vhtml'),
    ),
  );

  if (babelResult && babelResult.code) {
    callback(
      null,
      dedent`
      "use strict";
      var h = require(${vhtmlSrc});
      module.exports = function(data) {
        var htmlWebpackPlugin = data.htmlWebpackPlugin;
        ${babelResult.code}
        return "${doctype}" + (exports.default || module.exports);
      }
    `,
    );
  } else {
    callback(new Error('invalid BabelResult'));
  }
}
