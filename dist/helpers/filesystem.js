"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function asDirectory(importedPath, statSync = fs.statSync) {
  let isDirectory;
  try {
    isDirectory = statSync(importedPath).isDirectory();
  } catch (e) {
    isDirectory = false;
  }
  if (isDirectory) {
    return importedPath;
  }
  const simpleFilename = importedPath.split("/").pop();
  const basePath = importedPath.slice(0, -(simpleFilename || "").length - 1);
  return basePath.length > 0 ? basePath : ".";
}
exports.asDirectory = asDirectory;
function isParentDirOrSame(
  parent,
  dir,
  isAbsolute = path.isAbsolute,
  relative = path.relative
) {
  const relativePath = relative(parent, dir);
  return (
    (!relativePath.startsWith("..") && !isAbsolute(relativePath)) ||
    relativePath === ""
  );
}
exports.isParentDirOrSame = isParentDirOrSame;
