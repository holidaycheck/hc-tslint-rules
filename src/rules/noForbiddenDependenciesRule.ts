import * as ts from 'typescript';
import * as Lint from 'tslint';
import { IOptions } from 'tslint';
import { extractImportedFilename } from '../helpers/astParsing';

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
    const importedFilename = extractImportedFilename(node);
    if (!importedFilename) {
      return;
    }

    this.relevantForbiddenDependencies.forEach(
      (pathRegex: ForbiddenDependency) => {
        if (importedFilename.match(new RegExp(pathRegex.forbiddenImport))) {
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
