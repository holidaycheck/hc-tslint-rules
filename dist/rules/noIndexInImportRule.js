"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const typescript_1 = require("typescript");
class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile) {
    return this.applyWithWalker(
      new NoIndexInImportWalker(sourceFile, this.getOptions())
    );
  }
}
Rule.FAILURE_STRING =
  "import statements should not explicitly refer to index files.";
exports.Rule = Rule;
class NoIndexInImportWalker extends Lint.RuleWalker {
  importEndsOnIndex(importStatement) {
    if (importStatement === undefined) {
      return false;
    }
    return (
      importStatement.getText().endsWith("/index'") ||
      importStatement.getText().endsWith('/index"')
    );
  }
  visitImportDeclaration(node) {
    const importedFrom = node
      .getChildren()
      .find(child => child.kind === typescript_1.SyntaxKind.StringLiteral);
    if (this.importEndsOnIndex(importedFrom)) {
      const correctImport = node.getText().slice(0, node.getText().length - 8);
      const quotes = importedFrom
        .getText()
        .substring(importedFrom.getText().length - 1);
      this.addFailureAt(
        importedFrom.getStart(),
        importedFrom.getWidth(),
        `${Rule.FAILURE_STRING} Instead, use "${correctImport}${quotes}".`
      );
    }
    super.visitImportDeclaration(node);
  }
}
