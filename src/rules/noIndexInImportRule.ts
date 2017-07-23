import * as ts from 'typescript';
import * as Lint from 'tslint';
import { SyntaxKind } from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'import statements should not refer to index files';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoIndexInImportWalker(sourceFile, this.getOptions())
    );
  }
}

class NoIndexInImportWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    const importedFrom = node
      .getChildren()
      .find(child => child.kind === SyntaxKind.StringLiteral);
    if (
      importedFrom !== undefined &&
      (importedFrom.getText().endsWith("/index'") ||
        importedFrom.getText().endsWith('/index"'))
    ) {
      this.addFailureAt(
        importedFrom.getStart(),
        importedFrom.getWidth(),
        Rule.FAILURE_STRING
      );
    }
    super.visitImportDeclaration(node);
  }
}
