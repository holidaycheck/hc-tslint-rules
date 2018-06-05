"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const astParsing_1 = require("../helpers/astParsing");
const RuleForSpecificPaths_1 = require("./generic/RuleForSpecificPaths");
class Rule extends RuleForSpecificPaths_1.RuleForSpecificPaths {
  newWalker(sourceFile, options, relevantConfigurations) {
    return new NoForbiddenDependenciesWalker(
      sourceFile,
      options,
      relevantConfigurations
    );
  }
}
exports.Rule = Rule;
class NoForbiddenDependenciesWalker extends Lint.RuleWalker {
  constructor(sourceFile, options, relevantForbiddenDependencies) {
    super(sourceFile, options);
    this.relevantForbiddenDependencies = relevantForbiddenDependencies;
  }
  visitImportDeclaration(node) {
    const importedFilename = astParsing_1.extractImportedFilename(node);
    if (!importedFilename) {
      return;
    }
    this.relevantForbiddenDependencies.forEach(pathRegex => {
      if (importedFilename.match(new RegExp(pathRegex.forbiddenImport))) {
        this.addFailureAtNode(
          node,
          `Files in path matching "${
            pathRegex.path
          }" may not import from directories matching "${
            pathRegex.forbiddenImport
          }"`
        );
      }
    });
    super.visitImportDeclaration(node);
  }
}
