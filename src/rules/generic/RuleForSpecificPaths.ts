import * as ts from 'typescript';
import * as Lint from 'tslint';
import { IOptions } from 'tslint';

export abstract class RuleForSpecificPaths<
  C extends PathConfiguration,
  W extends Lint.RuleWalker
> extends Lint.Rules.AbstractRule {
  protected abstract newWalker(
    sourceFile: ts.SourceFile,
    options: IOptions,
    relevantConfigurations: C[]
  ): W;

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const options = this.getOptions().ruleArguments;
    const relevantConfigurations = options.filter(
      (pathRegex: PathConfiguration) =>
        sourceFile.fileName.match(new RegExp(pathRegex.path)) !== null
    );

    if (relevantConfigurations.length === 0) {
      return [];
    }

    return this.applyWithWalker(
      this.newWalker(sourceFile, this.getOptions(), relevantConfigurations)
    );
  }
}

export interface PathConfiguration {
  path: string;
}
