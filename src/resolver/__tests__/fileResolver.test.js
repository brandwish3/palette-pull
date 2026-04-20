const path = require('path');
const fs = require('fs');
const { readFile, isSupportedFile, getFileExtension, SUPPORTED_EXTENSIONS } = require('../fileResolver');

describe('isSupportedFile', () => {
  it('returns true for .css files', () => {
    expect(isSupportedFile('tokens.css')).toBe(true);
  });

  it('returns true for .scss files', () => {
    expect(isSupportedFile('styles.scss')).toBe(true);
  });

  it('returns false for .txt files', () => {
    expect(isSupportedFile('readme.txt')).toBe(false);
  });

  it('returns false for files with no extension', () => {
    expect(isSupportedFile('Makefile')).toBe(false);
  });
});

describe('getFileExtension', () => {
  it('returns the extension in lowercase', () => {
    expect(getFileExtension('Design.CSS')).toBe('.css');
  });

  it('returns empty string for no extension', () => {
    expect(getFileExtension('Makefile')).toBe('');
  });
});

describe('readFile', () => {
  it('throws if file does not exist', () => {
    expect(() => readFile('nonexistent_file_xyz.css')).toThrow('File not found');
  });

  it('reads existing file content', () => {
    const tmpPath = path.join(__dirname, '_tmp_test.css');
    fs.writeFileSync(tmpPath, ':root { --color: #fff; }');
    const content = readFile(tmpPath);
    expect(content).toContain('--color');
    fs.unlinkSync(tmpPath);
  });
});

describe('SUPPORTED_EXTENSIONS', () => {
  it('includes .html and .json', () => {
    expect(SUPPORTED_EXTENSIONS).toContain('.html');
    expect(SUPPORTED_EXTENSIONS).toContain('.json');
  });
});
