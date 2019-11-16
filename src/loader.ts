import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import { JSONSchema7 } from 'json-schema';
import { loader as WebpackLoader } from 'webpack';
import { transformAsync } from '@babel/core';

const schema: JSONSchema7 = {
  type: 'object',
  properties: {
    test: {
      type: 'string',
    },
  },
};

export default async function(
  this: WebpackLoader.LoaderContext,
  source: string,
) {
  const callback = this.async()!;
  const options = getOptions(this) || {};

  validateOptions(schema, options, {
    name: 'vhtml-loader',
  });

  const babelResult = await transformAsync(source, {
    plugins: [
      ['@babel/plugin-transform-react-jsx', { pragma: 'h', useBuiltIns: true }],
    ],
  });

  const moduleContent = `
    module.exports = '${eval(`
      const h = require('vhtml');
      ${babelResult!.code}
    `)}';
  `;

  callback(null, moduleContent);
}
