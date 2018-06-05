"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
class RuleForSpecificPaths extends Lint.Rules.AbstractRule {
  apply(sourceFile) {
    const options = this.getOptions().ruleArguments;
    const relevantConfigurations = options.filter(
      pathRegex =>
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
exports.RuleForSpecificPaths = RuleForSpecificPaths;
