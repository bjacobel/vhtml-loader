import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import { JSONSchema7 } from 'json-schema';
import { loader as WebpackLoader } from 'webpack';
import { transformAsync } from '@babel/core';

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
    name: 'vhtml-loader',
  });

  const babelResult = await transformAsync(source, {
    plugins: [
      require.resolve('./discardImports'),
      ['@babel/plugin-transform-react-jsx', { pragma: 'h', useBuiltIns: true }],
      '@babel/plugin-transform-modules-commonjs',
    ],
  });

  const vhtmlSrc = await new Promise((resolve, reject) =>
    this.loadModule('vhtml', (err, src) => (err ? reject(err) : resolve(src))),
  );

  // yeah I'll admit I don't fully understand the monster I've created here
  const templateSrc = `
    const module = { exports: {} };
    const { exports } = module;
    ${vhtmlSrc}
    const h = module.exports;
    
    ${babelResult!.code}
    if (typeof module.exports === 'string') {
      return module.exports;
    }
    return exports.default;
  `;

  const doctype = options.doctype ? '<!DOCTYPE html>' : '';

  const moduleContent = `module.exports = '${doctype}${new Function(
    templateSrc,
  )()}';`;

  callback(null, moduleContent);
}
