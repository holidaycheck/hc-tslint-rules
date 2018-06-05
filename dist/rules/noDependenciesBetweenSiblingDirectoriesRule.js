"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const path_1 = require("path");
const filesystem_1 = require("../helpers/filesystem");
const astParsing_1 = require("../helpers/astParsing");
const RuleForSpecificPaths_1 = require("./generic/RuleForSpecificPaths");
class Rule extends RuleForSpecificPaths_1.RuleForSpecificPaths {
  newWalker(sourceFile, options, relevantConfigurations) {
    return new NoSiblingDependenciesWalker(
      sourceFile,
      options,
      relevantConfigurations
    );
  }
}
exports.Rule = Rule;
class NoSiblingDependenciesWalker extends Lint.RuleWalker {
  constructor(sourceFile, options, relevantForbiddenDependencies) {
    super(sourceFile, options);
    this.relevantForbiddenDependencies = relevantForbiddenDependencies;
    const simpleFilename = sourceFile.fileName.split("/").pop();
    this.basePath = sourceFile.fileName.slice(
      0,
      -(simpleFilename || "").length - 1
    );
  }
  visitImportDeclaration(node) {
    this.relevantForbiddenDependencies.forEach(configuration => {
      if (!this.basePath) {
        return;
      }
      const importedFile = astParsing_1.extractImportedFilename(node);
      if (!importedFile) {
        return;
      }
      const isRelativeImport = importedFile.startsWith(".");
      if (
        !isRelativeImport ||
        (configuration.exceptionalImport &&
          importedFile.match(new RegExp(configuration.exceptionalImport)) !==
            null)
      ) {
        return;
      }
      const importedPath = filesystem_1.asDirectory(
        this.basePath + path_1.sep + importedFile
      );
      const isParent =
        filesystem_1.isParentDirOrSame(importedPath, this.basePath) ||
        filesystem_1.isParentDirOrSame(this.basePath, importedPath);
      if (!isParent) {
        this.addFailureAtNode(
          node,
          `Files in path matching "${
            configuration.path
          }" may not import from sibling directory as in "${importedFile}"`
        );
      }
    });
    super.visitImportDeclaration(node);
  }
}
