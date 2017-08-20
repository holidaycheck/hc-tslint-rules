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
  private importEndsOnIndex(
    importStatement: ts.Node | undefined
  ): importStatement is ts.Node {
    if (importStatement === undefined) {
      return false;
    }

    return (
      importStatement.getText().endsWith("/index'") ||
      importStatement.getText().endsWith('/index"')
    );
  }

  public visitImportDeclaration(node: ts.ImportDeclaration) {
    const importedFrom = node
      .getChildren()
      .find(child => child.kind === SyntaxKind.StringLiteral);

    if (this.importEndsOnIndex(importedFrom)) {
      this.addFailureAt(
        importedFrom.getStart(),
        importedFrom.getWidth(),
        Rule.FAILURE_STRING
      );
    }
    super.visitImportDeclaration(node);
  }
}
