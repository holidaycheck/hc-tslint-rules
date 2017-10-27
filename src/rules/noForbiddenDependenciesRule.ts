import * as ts from 'typescript';
import * as Lint from 'tslint';
import { IOptions } from 'tslint';
import { SyntaxKind } from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const options = this.getOptions().ruleArguments;
    const relevantForbiddenDependencies: ForbiddenDependency[] = options.filter(
      (pathRegex: ForbiddenDependency) =>
        sourceFile.fileName.match(new RegExp(pathRegex.path)) !== null
    );

    return this.applyWithWalker(
      new NoForbiddenDependenciesWalker(
        sourceFile,
        this.getOptions(),
        relevantForbiddenDependencies
      )
    );
  }
}

interface ForbiddenDependency {
  path: string;
  forbiddenImport: string;
}

class NoForbiddenDependenciesWalker extends Lint.RuleWalker {
  private relevantForbiddenDependencies: ForbiddenDependency[];

  constructor(
    sourceFile: ts.SourceFile,
    options: IOptions,
    relevantForbiddenDependencies: ForbiddenDependency[]
  ) {
    super(sourceFile, options);
    this.relevantForbiddenDependencies = relevantForbiddenDependencies;
  }

  public visitImportDeclaration(node: ts.ImportDeclaration) {
    this.relevantForbiddenDependencies.forEach(
      (pathRegex: ForbiddenDependency) => {
        const importedFromNode = node
          .getChildren()
          .find(child => child.kind === SyntaxKind.StringLiteral);

        if (
          importedFromNode &&
          importedFromNode
            .getText()
            .match(new RegExp(pathRegex.forbiddenImport))
        ) {
          this.addFailureAtNode(
            node,
            `Files in path matching "${pathRegex.path}" may not import from directories matching "${pathRegex.forbiddenImport}"`
          );
        }
      }
    );
    super.visitImportDeclaration(node);
  }
}
