import * as ts from 'typescript';
import * as Lint from 'tslint';
import { IOptions } from 'tslint';
import { sep } from 'path';

import { asDirectory, isParentDirOrSame } from '../helpers/filesystem';
import { extractImportedFilename } from '../helpers/astParsing';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const options = this.getOptions().ruleArguments;
    const relevantForbiddenDependencies: Configuration[] = options.filter(
      (pathRegex: Configuration) =>
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

interface Configuration {
  path: string;
  exceptionalImport: string;
}

class NoForbiddenDependenciesWalker extends Lint.RuleWalker {
  private relevantForbiddenDependencies: Configuration[];
  private basePath: string | undefined;

  constructor(
    sourceFile: ts.SourceFile,
    options: IOptions,
    relevantForbiddenDependencies: Configuration[]
  ) {
    super(sourceFile, options);
    this.relevantForbiddenDependencies = relevantForbiddenDependencies;
    const simpleFilename = sourceFile.fileName.split('/').pop();

    this.basePath = sourceFile.fileName.slice(
      0,
      -(simpleFilename || '').length - 1
    );
  }

  public visitImportDeclaration(node: ts.ImportDeclaration) {
    this.relevantForbiddenDependencies.forEach(
      (configuration: Configuration) => {
        if (!this.basePath) {
          return;
        }

        const importedFile = extractImportedFilename(node);
        if (!importedFile) {
          return;
        }

        const isRelativeImport = importedFile.startsWith('.');

        if (
          !isRelativeImport ||
          (configuration.exceptionalImport &&
            importedFile.match(new RegExp(configuration.exceptionalImport)) !==
              null)
        ) {
          return;
        }

        const importedPath = asDirectory(this.basePath + sep + importedFile);
        const isParent =
          isParentDirOrSame(importedPath, this.basePath) ||
          isParentDirOrSame(this.basePath, importedPath);

        if (!isParent) {
          this.addFailureAtNode(
            node,
            `Files in path matching "${configuration.path}" may not import from sibling directory as in "${importedFile}"`
          );
        }
      }
    );
    super.visitImportDeclaration(node);
  }
}
