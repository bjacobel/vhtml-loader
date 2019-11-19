import { NodePath, types } from '@babel/core';

export default () => {
  return {
    name: 'transform-fix-newlines',
    visitor: {
      StringLiteral(path: NodePath) {
        const lit = path.node as types.StringLiteral;
        if (/\n/.test(lit.value)) {
          path.replaceWith(types.stringLiteral(lit.value.replace('\n', '\r')));
        }
      },
    },
  };
};
