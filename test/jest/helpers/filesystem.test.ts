import {
  asDirectory,
  isParentDirOrSame
} from '../../../src/helpers/filesystem';
import { PathLike, Stats } from 'fs';

describe('filesystem', () => {
  describe('asDirectory', () => {
    const directoryStatMock: (path: PathLike) => any = path => ({
      isDirectory: () => true
    });
    const fileStatMock: (path: PathLike) => any = path => ({
      isDirectory: () => false
    });

    it('does not modify paths that are already a directory', () => {
      expect(asDirectory('./some-folder/test', directoryStatMock)).toEqual(
        './some-folder/test'
      );
      expect(asDirectory('..', directoryStatMock)).toEqual('..');
      expect(asDirectory('.', directoryStatMock)).toEqual('.');
    });

    it('only returns the base path for paths referring to files', () => {
      expect(asDirectory('./some-folder/test/file.ts', fileStatMock)).toEqual(
        './some-folder/test'
      );
      expect(asDirectory('./some-folder/test/file.tsx', fileStatMock)).toEqual(
        './some-folder/test'
      );
      expect(asDirectory('file.tsx', fileStatMock)).toEqual('.');
    });

    it('also returns the base path for paths referring to files even if file ending is left out', () => {
      expect(asDirectory('./some-folder/test/file', fileStatMock)).toEqual(
        './some-folder/test'
      );
      expect(asDirectory('file', fileStatMock)).toEqual('.');
    });
  });

  describe('isParentDirOrSame', () => {
    it('should return true when first argument is parent directory of second', () => {
      expect(isParentDirOrSame('./test', './test/a')).toEqual(true);
      expect(isParentDirOrSame('.', './a')).toEqual(true);
      expect(isParentDirOrSame('.', 'a')).toEqual(true);
    });

    it('should return false when second argument is parent directory of first', () => {
      expect(isParentDirOrSame('./test/a', './test')).toEqual(false);
      expect(isParentDirOrSame('./a', '.')).toEqual(false);
      expect(isParentDirOrSame('a', '.')).toEqual(false);
    });

    it('should return true if the same directory is passed twice', () => {
      expect(isParentDirOrSame('.', '.')).toEqual(true);
      expect(isParentDirOrSame('a', 'a')).toEqual(true);
      expect(isParentDirOrSame('./a', 'a')).toEqual(true);
      expect(isParentDirOrSame('../.', '..')).toEqual(true);
    });

    it('should return false for two unrelated directories', () => {
      expect(isParentDirOrSame('./test', './other-directory')).toEqual(false);
      expect(isParentDirOrSame('../test', '.')).toEqual(false);
      expect(isParentDirOrSame('a', 'b')).toEqual(false);
    });
  });
});
