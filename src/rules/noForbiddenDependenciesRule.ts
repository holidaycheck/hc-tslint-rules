import * as ts from 'typescript';
import * as Lint from 'tslint';
import { IOptions } from 'tslint';
import { extractImportedFilename } from '../helpers/astParsing';
import {
  PathConfiguration,
  RuleForSpecificPaths
} from './generic/RuleForSpecificPaths';

export class Rule extends RuleForSpecificPaths<
  Configuration,
  NoForbiddenDependenciesWalker
> {
  protected newWalker(
    sourceFile: ts.SourceFile,
    options: IOptions,
    relevantConfigurations: Configuration[]
  ): NoForbiddenDependenciesWalker {
    return new NoForbiddenDependenciesWalker(
      sourceFile,
      options,
      relevantConfigurations
    );
  }
}

interface Configuration extends PathConfiguration {
  forbiddenImport: string;
}

class NoForbiddenDependenciesWalker extends Lint.RuleWalker {
  private relevantForbiddenDependencies: Configuration[];

  constructor(
    sourceFile: ts.SourceFile,
    options: IOptions,
    relevantForbiddenDependencies: Configuration[]
  ) {
    super(sourceFile, options);
    this.relevantForbiddenDependencies = relevantForbiddenDependencies;
  }

  public visitImportDeclaration(node: ts.ImportDeclaration) {
    const importedFilename = extractImportedFilename(node);
    if (!importedFilename) {
      return;
    }

    this.relevantForbiddenDependencies.forEach((pathRegex: Configuration) => {
      if (importedFilename.match(new RegExp(pathRegex.forbiddenImport))) {
        this.addFailureAtNode(
          node,
          `Files in path matching "${pathRegex.path}" may not import from directories matching "${pathRegex.forbiddenImport}"`
        );
      }
    });
    super.visitImportDeclaration(node);
  }
}
