import * as ts from 'typescript';
import { SyntaxKind } from 'typescript';

export function extractImportedFilename(node: ts.ImportDeclaration) {
  const importedFromNode = node
    .getChildren()
    .find(child => child.kind === SyntaxKind.StringLiteral);

  if (!importedFromNode) {
    return;
  }

  return importedFromNode
    .getText()
    .slice(1, importedFromNode.getText().length - 1);
}
