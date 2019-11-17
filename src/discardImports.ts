import { NodePath } from '@babel/core';

export default () => {
  return {
    name: 'transform-discard-imports',
    visitor: {
      ImportDeclaration(path: NodePath) {
        path.remove();
      },
    },
  };
};
