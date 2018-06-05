"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
function extractImportedFilename(node) {
  const importedFromNode = node
    .getChildren()
    .find(child => child.kind === typescript_1.SyntaxKind.StringLiteral);
  if (!importedFromNode) {
    return;
  }
  return importedFromNode
    .getText()
    .slice(1, importedFromNode.getText().length - 1);
}
exports.extractImportedFilename = extractImportedFilename;
