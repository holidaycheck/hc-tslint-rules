import * as fs from 'fs';
import * as path from 'path';
import { PathLike, Stats } from 'fs';

export function asDirectory(
  importedPath: string,
  statSync: (path: PathLike) => Stats = fs.statSync
) {
  let isDirectory;
  try {
    isDirectory = statSync(importedPath).isDirectory();
  } catch (e) {
    isDirectory = false;
  }

  if (isDirectory) {
    return importedPath;
  }

  const simpleFilename = importedPath.split('/').pop();
  const basePath = importedPath.slice(0, -(simpleFilename || '').length - 1);

  return basePath.length > 0 ? basePath : '.';
}

export function isParentDirOrSame(
  parent: string,
  dir: string,
  isAbsolute: (path: string) => boolean = path.isAbsolute,
  relative: (dir1: string, dir2: string) => string = path.relative
) {
  const relativePath = relative(parent, dir);
  return (
    (!relativePath.startsWith('..') && !isAbsolute(relativePath)) ||
    relativePath === ''
  );
}
