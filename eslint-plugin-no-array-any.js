"use strict";

module.exports = {
  configs: {
    recommended: {
      plugins: ["no-array-any"],

      rules: {
        "no-array-any/no-array-any": "warn",
      },
    },
  },

  rules: {
    "no-array-any": {
      create: noArrayAny,

      meta: {
        type: "suggestion",

        docs: {
          description: "prevent declaring arrays that do not have a type",
        },

        fixable: "code",
      },
    },
  },
};

function noArrayAny(context) {
  if (
    !context.parserServices ||
    !context.parserServices.program ||
    !context.parserServices.esTreeNodeToTSNodeMap
  ) {
    /**
     * The user needs to have configured "project" in their parserOptions
     * for @typescript-eslint/parser
     */
    throw new Error(
      'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.'
    );
  }

  const typeChecker = context.parserServices.program.getTypeChecker();

  return {
    VariableDeclaration(node) {
      for (const declaration of node.declarations) {
        // From: https://github.com/typescript-eslint/typescript-eslint/issues/781
        const typescriptNode =
          context.parserServices.esTreeNodeToTSNodeMap.get(declaration);

        // Skip declarations like:
        // let [, b] = myArray;
        // (situations like this will cause a runtime error in the "getTypeAtLocation" method below)
        if (!typescriptNode.symbol) {
          continue;
        }

        const type = typeChecker.getTypeAtLocation(typescriptNode);
        if (type.resolvedTypeArguments === undefined) {
          continue;
        }

        for (const typeArgument of type.resolvedTypeArguments) {
          if (typeArgument.intrinsicName === "any") {
            context.report({
              node,
              message: "arrays must be declared with a type",
            });
          }
        }
      }
    },
  };
}
